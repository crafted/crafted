import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';

import {Item} from '../../github/app-types/item';
import {Github} from '../../service/github';
import {AppState} from '../../store';
import {UpdateContributorsFromGithub} from '../../store/contributor/contributor.action';
import {UpdateItemsFromGithub} from '../../store/item/item.action';
import {compareLocalToRemote} from '../utility/list-dao';

import {RepoState} from './active-store';

export interface StaleIssuesState {
  repository: string;
  lastUpdated: string;
  count: number;
}

export type UpdateState = 'can-update'|'updating'|'updated';

export type UpdatableType = 'items'|'labels'|'contributors';

export type UpdaterState = {
  [key in UpdatableType]: UpdateState
};

@Injectable()
export class Updater {
  state = new BehaviorSubject<UpdaterState>({
    items: 'can-update',
    labels: 'can-update',
    contributors: 'can-update',
  });

  constructor(private github: Github, private store: Store<AppState>) {}

  update(repoState: RepoState, type: UpdatableType) {
    switch (type) {
      case 'items':
        return this.updateIssues();
      case 'labels':
        return this.updateLabels(repoState);
      case 'contributors':
        return this.updateContributors();
    }
  }

  private updateLabels(repoState: RepoState) {
    this.setTypeState('labels', 'updating');

    const remoteLabels$ = this.store.select(state => state.repository.name)
                              .pipe(
                                  mergeMap(repository => this.github.getLabels(repository)),
                                  filter(result => result.completed === result.total),
                                  map(result => result.accumulated));

    combineLatest(repoState.labelsDao.list, remoteLabels$).pipe(take(1)).subscribe(([
                                                                                     local, remote
                                                                                   ]) => {
      const comparison = compareLocalToRemote(local, remote);
      repoState.labelsDao.update(comparison.toUpdate);
      this.setTypeState('labels', 'updated');
    });
  }

  private updateContributors() {
    this.setTypeState('contributors', 'updating');

    const localList$ = this.store.select(
        state => state.contributors.ids.map(id => state.contributors.entities[id]));
    const remoteList$ = this.store.select(state => state.repository.name)
                            .pipe(
                                mergeMap(repository => this.github.getContributors(repository)),
                                filter(result => result.completed === result.total),
                                map(result => result.accumulated));

    combineLatest(localList$, remoteList$).pipe(take(1)).subscribe(([local, remote]) => {
      const comparison = compareLocalToRemote(local, remote);
      this.store.dispatch(new UpdateContributorsFromGithub({contributors: comparison.toUpdate}));
      this.setTypeState('contributors', 'updated');
    });
  }

  private updateIssues() {
    this.setTypeState('items', 'updating');

    this.getStaleIssuesState()
        .pipe(
            mergeMap(result => {
              if (!result.count) {
                return of([]);
              }

              return this.getAllStaleIssues(result.repository, result.lastUpdated);
            }),
            take(1))
        .subscribe((result) => {
          if (result.length) {
            this.store.dispatch(new UpdateItemsFromGithub({items: result}));
          }
          this.setTypeState('items', 'updated');
        });
  }

  private getAllStaleIssues(repository: string, lastUpdated: string): Observable<Item[]> {
    return this.github.getIssues(repository, lastUpdated)
        .pipe(filter(result => !result || result.total === result.completed), map(result => {
                return result ? result.accumulated : [];
              }));
  }

  private getStaleIssuesState(): Observable<StaleIssuesState> {
    let lastUpdated = '';

    // TODO: Cleanup - should not stash repository
    let repository = '';
    return this.store.pipe(
        filter(state => !!state.items.ids.length), take(1), map(state => {
          repository = state.repository.name;
          state.items.ids.forEach(id => {
            const item = state.items.entities[id];
            if (!lastUpdated || lastUpdated < item.updated) {
              lastUpdated = item.updated;
            }
          });

          return lastUpdated;
        }),
        mergeMap(() => this.github.getItemsCount(repository, lastUpdated)),
        map(count => ({lastUpdated, count, repository})));
  }

  private setTypeState(type: UpdatableType, typeState: UpdateState) {
    this.state.pipe(take(1)).subscribe(updaterState => {
      const newState = {...updaterState};
      newState[type] = typeState;
      this.state.next(newState);
    });
  }
}
