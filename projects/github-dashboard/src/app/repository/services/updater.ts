import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Contributor} from '../../github/app-types/contributor';

import {Item} from '../../github/app-types/item';
import {Label} from '../../github/app-types/label';
import {Github} from '../../service/github';
import {AppState} from '../store';
import {UpdateContributorsFromGithub} from '../store/contributor/contributor.action';
import {selectContributors} from '../store/contributor/contributor.reducer';
import {UpdateItemsFromGithub} from '../store/item/item.action';
import {selectItems} from '../store/item/item.reducer';
import {UpdateLabelsFromGithub} from '../store/label/label.action';
import {selectLabels} from '../store/label/label.reducer';
import {selectRepositoryName} from '../store/name/name.reducer';
import {compareLocalToRemote} from '../utility/compare-local-to-remote';

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

  update(type: UpdatableType) {
    switch (type) {
      case 'items':
        return this.updateIssues();
      case 'labels':
        return this.updateLabels();
      case 'contributors':
        return this.updateContributors();
    }
  }

  private updateLabels() {
    this.setTypeState('labels', 'updating');

    const localList$ = this.store.select(selectLabels);
    const remoteLabels$ = this.store.select(selectRepositoryName)
                              .pipe(
                                  mergeMap(repository => this.github.getLabels(repository)),
                                  filter(result => result.completed === result.total),
                                  map(result => result.accumulated));

    combineLatest(localList$, remoteLabels$).pipe(take(1)).subscribe(([local, remote]) => {
      const comparison = compareLocalToRemote<Label>(local, remote);
      this.store.dispatch(new UpdateLabelsFromGithub({labels: comparison.toUpdate}));
      this.setTypeState('labels', 'updated');
    });
  }

  private updateContributors() {
    this.setTypeState('contributors', 'updating');

    const localList$ = this.store.select(selectContributors);
    const remoteList$ = this.store.select(selectRepositoryName)
                            .pipe(
                                mergeMap(repository => this.github.getContributors(repository)),
                                filter(result => result.completed === result.total),
                                map(result => result.accumulated));

    combineLatest(localList$, remoteList$).pipe(take(1)).subscribe(([local, remote]) => {
      const comparison = compareLocalToRemote<Contributor>(local, remote);
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
    return combineLatest(this.store.select(selectRepositoryName), this.store.select(selectItems)).pipe(
        filter(([name, items]) => !!items.length), take(1), map(([name, items]) => {
          repository = name;
          items.forEach(item => {
            if (!lastUpdated || lastUpdated < item.updated) {
              lastUpdated = item.updated;
            }
          });

          return [name, lastUpdated];
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
