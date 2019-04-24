import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, tap} from 'rxjs/operators';
import {Contributor} from '../../github/app-types/contributor';
import {Item} from '../../github/app-types/item';
import {Label} from '../../github/app-types/label';
import {Github} from '../../service/github';
import {DataStore, RepoDaoType} from './dao/data-dao';
import {compareLocalToRemote, ListDao} from './dao/list-dao';

export interface StaleIssuesState {
  repository: string;
  lastUpdated: string;
  count: number;
}

@Injectable()
export class Updater {
  constructor(private github: Github) {}

  update(store: DataStore, type: RepoDaoType): Promise<void> {
    switch (type) {
      case 'items':
        return this.updateIssues(store);
      case 'labels':
        return this.updateLabels(store.name, store.labels);
      case 'contributors':
        return this.updateContributors(store.name, store.contributors);
    }
  }

  private updateLabels(repository: string, labelsDao: ListDao<Label>): Promise<void> {
    let remoteList: Label[] = [];
    return new Promise(resolve => {
      this.github.getLabels(repository)
          .pipe(
              filter(result => result.completed === result.total), take(1),
              tap(result => remoteList = result.accumulated), mergeMap(() => labelsDao.list),
              take(1))
          .subscribe(localList => {
            const comparison = compareLocalToRemote(localList, remoteList);
            labelsDao.update(comparison.toUpdate);
            resolve();
          });
    });
  }

  private updateContributors(repository: string, contributorsDao: ListDao<Contributor>):
      Promise<void> {
    let remoteList: Contributor[] = [];

    return new Promise(resolve => {
      this.github.getContributors(repository)
          .pipe(
              filter(result => result.completed === result.total), take(1),
              tap(result => remoteList = result.accumulated), mergeMap(() => contributorsDao.list),
              take(1))
          .subscribe(localList => {
            const comparison = compareLocalToRemote(localList, remoteList);
            contributorsDao.update(comparison.toUpdate);
            resolve();
          });
    });
  }

  private updateIssues(store: DataStore): Promise<void> {
    return new Promise(resolve => {
      this.getStaleIssuesState(store)
          .pipe(
              mergeMap(state => {
                return state.count ? this.getAllStaleIssues(state.repository, state.lastUpdated) :
                                     of([]);
              }),
              take(1))
          .subscribe((result) => {
            if (result.length) {
              store.items.update(result);
            }
            resolve();
          });
    });
  }

  getAllStaleIssues(repository: string, lastUpdated: string): Observable<Item[]> {
    return this.github.getIssues(repository, lastUpdated)
        .pipe(filter(result => !result || result.total === result.completed), map(result => {
                return result ? result.accumulated : [];
              }));
  }

  getStaleIssuesState(store: DataStore): Observable<StaleIssuesState> {
    let lastUpdated = '';

    return store.items.list.pipe(
        map(items => {
          items.forEach(item => {
            if (!lastUpdated || lastUpdated < item.updated) {
              lastUpdated = item.updated;
            }
          });

          return lastUpdated;
        }),
        mergeMap(() => this.github.getItemsCount(store.name, lastUpdated)),
        map(count => ({lastUpdated, count, repository: store.name})));
  }
}
