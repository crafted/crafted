import {ChangeDetectionStrategy, Component, InjectionToken} from '@angular/core';
import {Router} from '@angular/router';
import {DataResources} from '@crafted/data';
import {Store} from '@ngrx/store';
import {combineLatest, interval, Subject} from 'rxjs';
import {debounceTime, filter, map, mergeMap, take, takeUntil} from 'rxjs/operators';

import {getDataSourceProvider} from '../github/data-source/item-data-source-metadata';
import {getFiltererProvider} from '../github/data-source/item-filterer-metadata';
import {getGrouperProvider} from '../github/data-source/item-grouper-metadata';
import {getSorterProvider} from '../github/data-source/item-sorter-metadata';
import {getViewerProvider} from '../github/data-source/item-viewer-metadata';
import {Config} from '../service/config';
import {LoadedRepos} from '../service/loaded-repos';
import {selectAuthState} from '../store/auth/auth.reducer';

import {Remover} from './services/remover';
import {RepoGist} from './services/repo-gist';
import {Updater} from './services/updater';
import {AppState} from './store';
import {selectDashboards} from './store/dashboard/dashboard.reducer';
import {selectItems, selectItemTotal} from './store/item/item.reducer';
import {selectLabels} from './store/label/label.reducer';
import {selectQueryList} from './store/query/query.reducer';
import {selectRecommendations} from './store/recommendation/recommendation.reducer';
import {selectRepositoryName} from './store/repository/repository.reducer';
import {getRecommendations} from './utility/get-recommendations';

export const DATA_RESOURCES_MAP =
    new InjectionToken<Map<string, DataResources>>('data-resources-map');

export const provideDataResourcesMap = (store: Store<AppState>) => {
  const recommendations = store.select(selectRecommendations);
  const labels = store.select(selectLabels);

  const allItems = store.select(selectItems);
  const issues = allItems.pipe(map(items => items.filter(i => !i.pr)));
  const prs = allItems.pipe(map(items => items.filter(i => !!i.pr)));

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
  providers: [{provide: DATA_RESOURCES_MAP, useFactory: provideDataResourcesMap, deps: [Store]}]
})
export class Repository {
  private destroyed = new Subject();

  constructor(
      private router: Router, private updater: Updater, private loadedRepos: LoadedRepos,
      private remover: Remover, private repoGist: RepoGist,
      private config: Config, private store: Store<AppState>) {
    combineLatest(this.store.select(selectRepositoryName), this.store.select(selectAuthState))
        .pipe(filter(([repository, authState]) => !!repository), take(1))
        .subscribe(([repository, authState]) => {
          if (!this.loadedRepos.isLoaded(repository)) {
            this.router.navigate([`${repository}/database`]);
          } else if (authState.accessToken) {
            this.updater.update('items');
            this.updater.update('contributors');
            this.updater.update('labels');
            this.initializeAutoIssueUpdates();
          }

          // Sync and then start saving
          this.repoGist.sync(name).pipe(take(1)).subscribe(() => {
            this.saveConfigChangesToGist(name, this.store);
          });
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private initializeAutoIssueUpdates() {
    // TODO: This never unsubscribes and does not check if we are already updating a repository
    interval(60 * 1000)
        .pipe(
            mergeMap(() => this.store.select(selectItemTotal)),
            filter(total => !!total), take(1))
        .subscribe(() => {
          this.updater.update('items');
        });
  }

  /** Persist changes to config lists to gist */
  private saveConfigChangesToGist(repository: string, store: Store<AppState>) {
    const configDaoLists = [
      store.select(selectDashboards),
      store.select(selectQueryList),
      store.select(selectRecommendations)
    ];
    combineLatest(...configDaoLists)
        .pipe(debounceTime(500), takeUntil(this.destroyed))
        .subscribe(([dashboards, queries, recommendations]) => {
          this.config.saveRepoConfigToGist(repository, {dashboards, queries, recommendations});
        });
  }
}
