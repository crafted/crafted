import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Item} from '../../github/app-types/item';
import {Github} from '../../service/github';
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

  constructor(private github: Github) {}

  update(repoState: RepoState, type: UpdatableType) {
    switch (type) {
      case 'items':
        return this.updateIssues(repoState);
      case 'labels':
        return this.updateLabels(repoState);
      case 'contributors':
        return this.updateContributors(repoState);
    }
  }

  updateItem(repoState: RepoState, id: string) {
    this.github.getItem(repoState.repository, id).pipe(take(1)).subscribe(item => {
      repoState.itemsDao.update(item);
    });
  }

  private updateLabels(repoState: RepoState) {
    this.setTypeState('labels', 'updating');

    const remoteLabels$ = this.github.getLabels(repoState.repository)
                              .pipe(
                                  filter(result => result.completed === result.total),
                                  map(result => result.accumulated));

    combineLatest(repoState.labelsDao.list, remoteLabels$)
        .pipe(take(1))
        .subscribe(([local, remote]) => {
          const comparison = compareLocalToRemote(local, remote);
          repoState.labelsDao.update(comparison.toUpdate);
          this.setTypeState('labels', 'updated');
        });
  }

  private updateContributors(repoState: RepoState) {
    this.setTypeState('contributors', 'updating');

    const localList$ = repoState.contributorsDao.list;
    const remoteList$ = this.github.getContributors(repoState.repository)
                             .pipe(
                                 filter(result => result.completed === result.total),
                                 map(result => result.accumulated));

    combineLatest(localList$, remoteList$).pipe(take(1)).subscribe(([local, remote]) => {
      const comparison = compareLocalToRemote(local, remote);
      repoState.contributorsDao.update(comparison.toUpdate);
      this.setTypeState('contributors', 'updated');
    });
  }

  private updateIssues(repoState: RepoState) {
    this.setTypeState('items', 'updating');

    this.getStaleIssuesState(repoState)
        .pipe(
            mergeMap(result => {
              if (!result.count) {
                return of([]);
              }

              return this.getAllStaleIssues(repoState.repository, result.lastUpdated);
            }),
            take(1))
        .subscribe((result) => {
          if (result.length) {
            repoState.itemsDao.update(result);
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

  private getStaleIssuesState(repoState: RepoState): Observable<StaleIssuesState> {
    let lastUpdated = '';

    return repoState.itemsDao.list.pipe(
        map(items => {
          items.forEach(item => {
            if (!lastUpdated || lastUpdated < item.updated) {
              lastUpdated = item.updated;
            }
          });

          return lastUpdated;
        }),
        mergeMap(() => this.github.getItemsCount(repoState.repository, lastUpdated)),
        map(count => ({lastUpdated, count, repository: repoState.repository})));
  }

  private setTypeState(type: UpdatableType, typeState: UpdateState) {
    this.state.pipe(take(1)).subscribe(updaterState => {
      const newState = {...updaterState};
      newState[type] = typeState;
      this.state.next(newState);
    });
  }
}
