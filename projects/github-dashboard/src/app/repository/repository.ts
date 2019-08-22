import {ChangeDetectionStrategy, Component, InjectionToken} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {DataSource, Filterer, FiltererState, Grouper, GrouperState, Sorter, SorterState, Viewer, ViewerState,} from '@crafted/data';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap} from 'rxjs/operators';

import {getDataSourceProvider} from '../github/data-source/item-data-source-metadata';
import {getFiltererProvider} from '../github/data-source/item-filterer-metadata';
import {getGrouperProvider} from '../github/data-source/item-grouper-metadata';
import {getSorterProvider} from '../github/data-source/item-sorter-metadata';
import {DEFAULT_ISSUE_VIEWS, DEFAULT_PR_VIEWS, getViewerProvider, ViewType} from '../github/data-source/item-viewer-metadata';
import {Config} from '../service/config';
import {selectUserName} from '../store/auth/auth.reducer';
import {selectIsRepoLoaded} from '../store/loaded-repos/loaded-repos.reducer';

import {Remover} from './services/remover';
import {RepoGist} from './services/repo-gist';
import {Updater} from './services/updater';
import {AppState} from './store';
import {LoadContributors} from './store/contributor/contributor.action';
import {selectContributorsLoading} from './store/contributor/contributor.reducer';
import {LoadDashboards} from './store/dashboard/dashboard.action';
import {selectDashboards} from './store/dashboard/dashboard.reducer';
import {LoadItems} from './store/item/item.action';
import {selectItems, selectItemsLoading} from './store/item/item.reducer';
import {LoadLabels} from './store/label/label.action';
import {selectLabels, selectLabelsLoading} from './store/label/label.reducer';
import {SetName} from './store/name/name.action';
import {selectRepositoryName} from './store/name/name.reducer';
import {LoadRepositoryPermission} from './store/permission/permission.action';
import {LoadQueries} from './store/query/query.action';
import {selectQueryList} from './store/query/query.reducer';
import {LoadRecommendations} from './store/recommendation/recommendation.action';
import {selectRecommendations} from './store/recommendation/recommendation.reducer';
import {getRecommendations} from './utility/get-recommendations';

export interface DataResources {
  type: string;
  label: string;
  loading: Observable<boolean>;
  viewer: (viewType: Observable<ViewType>, initialState?: ViewerState) => Viewer;
  filterer: (initialState?: FiltererState) => Filterer;
  grouper: (initialState?: GrouperState) => Grouper;
  sorter: (initialState?: SorterState) => Sorter;
  dataSource: () => DataSource;
  defaultViews: string[];
}

// TODO: Move this to a model folder
export type DataType = 'issue'|'pr';

export const DATA_RESOURCES_MAP =
    new InjectionToken<Map<string, DataResources>>('data-resources-map');

export const provideDataResourcesMap = (store: Store<AppState>) => {
  const labels = store.select(selectLabels);

  const allItems = store.select(selectItems);
  const issues = allItems.pipe(map(items => items.filter(i => !i.pr)));
  const prs = allItems.pipe(map(items => items.filter(i => !!i.pr)));

  const allRecommendations = store.select(selectRecommendations);
  const issueRecommendations =
      allRecommendations.pipe(map(list => list.filter(r => r.dataType === 'issue')));
  const prRecommendations =
      allRecommendations.pipe(map(list => list.filter(r => r.dataType === 'pr')));

  return new Map<DataType, DataResources>([
    [
      'issue', {
        type: 'issue',
        label: 'Issues',
        loading: store.select(selectItemsLoading),
        dataSource: getDataSourceProvider(issues) as (() => DataSource<any>),
        viewer: getViewerProvider(labels, issueRecommendations),
        filterer: getFiltererProvider(labels, issueRecommendations, getRecommendations),
        grouper: getGrouperProvider(labels),
        sorter: getSorterProvider(),
        defaultViews: DEFAULT_ISSUE_VIEWS,
      }
    ],
    [
      'pr', {
        type: 'pr',
        label: 'Pull Requests',
        loading: store.select(selectItemsLoading),
        dataSource: getDataSourceProvider(prs),
        viewer: getViewerProvider(labels, prRecommendations),
        filterer: getFiltererProvider(labels, prRecommendations, getRecommendations),
        grouper: getGrouperProvider(labels),
        sorter: getSorterProvider(),
        defaultViews: DEFAULT_PR_VIEWS,
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
  isDataLoading =
      combineLatest(
          this.store.select(selectItemsLoading), this.store.select(selectContributorsLoading),
          this.store.select(selectLabelsLoading))
          .pipe(map(result => result.some(v => v)));

  private destroyed = new Subject();

  private activeRepository = this.router.events.pipe(toActiveRepositoryName);

  constructor(
      private router: Router, private updater: Updater, private remover: Remover,
      private repoGist: RepoGist, private config: Config, private store: Store<AppState>) {
    // Load repository data when a new active repository is set.
    this.activeRepository.pipe(takeUntil(this.destroyed))
        .subscribe(repository => this.loadRepository(repository));

    // Sync config from gists and then start saving config changes
    this.activeRepository.pipe(switchMap(
        repository =>
            this.repoGist.sync(repository)
                .pipe(take(1), tap(() => this.saveConfigChangesToGist(repository, this.store)))));

    // Load repository permissions when the repository name or user name changes.
    combineLatest(this.store.select(selectRepositoryName), this.store.select(selectUserName))
        .pipe(takeUntil(this.destroyed))
        .subscribe(([repository, user]) => {
          this.store.dispatch(new LoadRepositoryPermission({repository, user}));
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /** Persist changes to config lists to gist */
  private saveConfigChangesToGist(repository: string, store: Store<AppState>) {
    const configDaoLists = [
      store.select(selectDashboards), store.select(selectQueryList),
      store.select(selectRecommendations)
    ];
    combineLatest(...configDaoLists)
        .pipe(debounceTime(500), takeUntil(this.destroyed))
        .subscribe(([dashboards, queries, recommendations]) => {
          this.config.saveRepoConfigToGist(repository, {dashboards, queries, recommendations});
        });
  }

  private loadRepository(repository: string) {
    this.store.select(selectIsRepoLoaded(repository)).pipe(take(1)).subscribe(isRepoLoaded => {
      if (!isRepoLoaded) {
        this.router.navigate(['']);
        return;
      }

      this.store.dispatch(new SetName({repository}));
      this.store.dispatch(new LoadContributors({repository}));
      this.store.dispatch(new LoadDashboards({repository}));
      this.store.dispatch(new LoadItems({repository}));
      this.store.dispatch(new LoadLabels({repository}));
      this.store.dispatch(new LoadQueries({repository}));
      this.store.dispatch(new LoadRecommendations({repository}));
    });
  }
}

/**
 * Transforms a stream of router events into a stream of the current repository name.
 */
function toActiveRepositoryName(event$: Observable<Event>): Observable<string> {
  return event$.pipe(
      filter(event => event instanceof NavigationEnd), map((navigationEnd: NavigationEnd) => {
        const url = navigationEnd.urlAfterRedirects;

        if (url === '/') {
          return '';
        }

        const urlParts = url.split('/');
        return `${urlParts[1]}/${urlParts[2]}`;
      }),
      distinctUntilChanged());
}
