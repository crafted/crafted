import {ChangeDetectionStrategy, Component, InjectionToken} from '@angular/core';
import {Router} from '@angular/router';
import {DataResources} from '@crafted/data';
import {combineLatest, interval, Observable} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Item} from '../github/app-types/item';
import {getDataSourceProvider} from '../github/data-source/item-data-source-metadata';
import {getFiltererProvider} from '../github/data-source/item-filterer-metadata';
import {getGrouperProvider} from '../github/data-source/item-grouper-metadata';
import {getSorterProvider} from '../github/data-source/item-sorter-metadata';
import {getViewerProvider} from '../github/data-source/item-viewer-metadata';
import {Auth} from '../service/auth';
import {LoadedRepos} from '../service/loaded-repos';
import {ActiveStore} from './services/active-store';
import {DataStore} from './services/dao/data-dao';
import {Remover} from './services/remover';
import {Updater} from './services/updater';
import {getRecommendations} from './utility/get-recommendations';
import {isRepoStoreEmpty} from './utility/is-repo-store-empty';

export const DATA_RESOURCES_MAP =
    new InjectionToken<Map<string, DataResources>>('data-resources-map');

/** Observable pipe that gets the list of issues from the data store. */
function dataStoreIssuesList(): (dataStore$: Observable<DataStore>) => Observable<Item[]> {
  return (dataStore$: Observable<DataStore>) => {
    return dataStore$.pipe(
      mergeMap(dataStore => dataStore.items.list), map(items => items.filter(i => !i.pr)));
  };
}

/** Observable pipe that gets the list of prs from the data store. */
function dataStorePrsList(): (dataStore$: Observable<DataStore>) => Observable<Item[]> {
  return (dataStore$: Observable<DataStore>) => {
    return dataStore$.pipe(
      mergeMap(dataStore => dataStore.items.list), map(items => items.filter(i => !i.pr)));
  };
}

export const provideDataResourcesMap = (activeStore: ActiveStore) => {
  const recommendations =
    activeStore.config.pipe(mergeMap(dataStore => dataStore.recommendations.list));
  const labels = activeStore.data.pipe(mergeMap(dataStore => dataStore.labels.list));
  const issues = activeStore.data.pipe(dataStoreIssuesList());
  const prs = activeStore.data.pipe(dataStorePrsList());

  return new Map<string, DataResources>([
    [
      'issue', {
      type: 'issue',
        label: 'Issues',
        dataSource: getDataSourceProvider(issues),
        viewer: getViewerProvider(labels, recommendations),
        filterer: getFiltererProvider(labels, recommendations, getRecommendations),
        grouper: getGrouperProvider(labels),
        sorter: getSorterProvider(),
      }
    ],
    [
      'pr', {
      type: 'pr',
        label: 'Pull Requests',
        dataSource: getDataSourceProvider(prs),
        viewer: getViewerProvider(labels, recommendations),
        filterer: getFiltererProvider(labels, recommendations, getRecommendations),
        grouper: getGrouperProvider(labels),
        sorter: getSorterProvider(),
      }
    ],
  ]);
};

@Component({
  templateUrl: 'repository.html',
  styleUrls: ['repository.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:
      [{provide: DATA_RESOURCES_MAP, useFactory: provideDataResourcesMap, deps: [ActiveStore]}]
})
export class Repository {
  constructor(
    private router: Router, private updater: Updater, private loadedRepos: LoadedRepos,
    private remover: Remover, private activeStore: ActiveStore, private auth: Auth) {
    const isEmpty$ =
      this.activeStore.data.pipe(mergeMap(store => isRepoStoreEmpty(store).pipe(take(1))));

    combineLatest(this.activeStore.data, isEmpty$).pipe(take(1)).subscribe(results => {
      const dataStore = results[0];
      const isEmpty = results[1];
      const isLoaded = this.loadedRepos.isLoaded(dataStore.name);

      if (!isEmpty && !isLoaded) {
        this.remover.removeAllData(dataStore, false);
      }

      if (isEmpty) {
        this.router.navigate([`${dataStore.name}/database`]);
      } else if (this.auth.token) {
        this.initializeAutoIssueUpdates(dataStore);
      }
    });
  }

  private initializeAutoIssueUpdates(store: DataStore) {
    interval(60 * 1000)
        .pipe(mergeMap(() => store.items.list.pipe(take(1))), filter(items => items.length > 0))
        .subscribe(() => {
          this.updater.update(store, 'items');
        });

    this.updater.update(store, 'contributors');
    this.updater.update(store, 'labels');
  }
}
