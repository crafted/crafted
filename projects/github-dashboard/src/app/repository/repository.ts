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
import {Auth} from '../service/auth';
import {Config} from '../service/config';
import {LoadedRepos} from '../service/loaded-repos';
import {AppState} from '../store';
import {selectAllDashboards} from '../store/dashboard/dashboard.reducer';
import {selectAllItems} from '../store/item/item.reducer';
import {selectAllLabels} from '../store/label/label.reducer';
import {selectAllQueries} from '../store/query/query.reducer';
import {selectAllRecommendations} from '../store/recommendation/recommendation.reducer';

import {ActiveStore, RepoState} from './services/active-store';
import {PageNavigator} from './services/page-navigator';
import {Remover} from './services/remover';
import {RepoGist} from './services/repo-gist';
import {Updater} from './services/updater';
import {getRecommendations} from './utility/get-recommendations';

export const DATA_RESOURCES_MAP =
    new InjectionToken<Map<string, DataResources>>('data-resources-map');

export const provideDataResourcesMap = (store: Store<AppState>) => {
  const recommendations = store.select(state => selectAllRecommendations(state.recommendations));
  const labels = store.select(state => selectAllLabels(state.labels));

  const allItems = store.select(state => selectAllItems(state.items));
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
  providers: [
    {provide: DATA_RESOURCES_MAP, useFactory: provideDataResourcesMap, deps: [Store]}
  ]
})
export class Repository {
  private destroyed = new Subject();

  constructor(
      private router: Router, private updater: Updater, private loadedRepos: LoadedRepos,
      private remover: Remover, private activeStore: ActiveStore, private auth: Auth,
      private pageNavigator: PageNavigator, private repoGist: RepoGist, private config: Config,
      private store: Store<AppState>) {
    combineLatest(this.store.select(s => s.repository.name), this.activeStore.state)
        .pipe(take(1))
        .subscribe(([repository, repoState]) => {
          if (!this.loadedRepos.isLoaded(repository)) {
            this.pageNavigator.navigateToDatabase();
          } else if (this.auth.token) {
            this.updater.update(repoState, 'items');
            this.updater.update(repoState, 'contributors');
            this.updater.update(repoState, 'labels');
            this.initializeAutoIssueUpdates(repoState);
          }

          // Sync and then start saving
          this.repoGist.sync(name, repoState).pipe(take(1)).subscribe(() => {
            this.saveConfigChangesToGist(name, this.store);
          });
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private initializeAutoIssueUpdates(repoState: RepoState) {
    // TODO: This never unsubscribes and does not check if we are already updating a repository
    interval(60 * 1000)
        .pipe(
            mergeMap(() => this.store.select(state => state.items)),
            filter(itemsState => itemsState.ids.length > 0), take(1))
        .subscribe(() => {
          this.updater.update(repoState, 'items');
        });
  }

  /** Persist changes to config lists to gist */
  private saveConfigChangesToGist(repository: string, store: Store<AppState>) {
    const configDaoLists = [
      store.select(state => selectAllDashboards(state.dashboards)),
      store.select(state => selectAllQueries(state.queries)),
      store.select(state => selectAllRecommendations(state.recommendations))
    ];
    combineLatest(...configDaoLists)
        .pipe(debounceTime(500), takeUntil(this.destroyed))
        .subscribe(([dashboards, queries, recommendations]) => {
          this.config.saveRepoConfigToGist(repository, {dashboards, queries, recommendations});
        });
  }
}
