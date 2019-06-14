import {ChangeDetectionStrategy, Component, InjectionToken} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {
  DataSource,
  Filterer,
  FiltererState,
  Grouper,
  GrouperState,
  Sorter,
  SorterState,
  Viewer,
  ViewerState,
} from '@crafted/data';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';

import {getDataSourceProvider} from '../github/data-source/item-data-source-metadata';
import {getFiltererProvider} from '../github/data-source/item-filterer-metadata';
import {getGrouperProvider} from '../github/data-source/item-grouper-metadata';
import {getSorterProvider} from '../github/data-source/item-sorter-metadata';
import {getViewerProvider} from '../github/data-source/item-viewer-metadata';
import {Config} from '../service/config';
import {selectIsRepoLoaded} from '../store/loaded-repos/loaded-repos.reducer';

import {Remover} from './services/remover';
import {RepoGist} from './services/repo-gist';
import {Updater} from './services/updater';
import {AppState} from './store';
import {LoadContributors} from './store/contributor/contributor.action';
import {LoadDashboards} from './store/dashboard/dashboard.action';
import {selectDashboards} from './store/dashboard/dashboard.reducer';
import {LoadItems} from './store/item/item.action';
import {selectItems, selectItemsLoading} from './store/item/item.reducer';
import {LoadLabels} from './store/label/label.action';
import {selectLabels} from './store/label/label.reducer';
import {LoadQueries} from './store/query/query.action';
import {selectQueryList} from './store/query/query.reducer';
import {LoadRecommendations} from './store/recommendation/recommendation.action';
import {selectRecommendations} from './store/recommendation/recommendation.reducer';
import {SetName} from './store/repository/repository.action';
import {getRecommendations} from './utility/get-recommendations';

export interface DataResources {
  type: string;
  label: string;
  loading: Observable<boolean>;
  viewer: (initialState?: ViewerState) => Viewer;
  filterer: (initialState?: FiltererState) => Filterer;
  grouper: (initialState?: GrouperState) => Grouper;
  sorter: (initialState?: SorterState) => Sorter;
  dataSource: () => DataSource;
}

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
        loading: store.select(selectItemsLoading),
        dataSource: getDataSourceProvider(issues) as (() => DataSource<any>),
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
      loading: store.select(selectItemsLoading),
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

  private activeRepository = this.router.events.pipe(toActiveRepositoryName);

  constructor(
      private router: Router, private updater: Updater, private remover: Remover,
      private repoGist: RepoGist, private config: Config, private store: Store<AppState>) {
    this.activeRepository.pipe(takeUntil(this.destroyed)).subscribe(repository => {
      this.store.select(selectIsRepoLoaded(repository)).pipe(take(1)).subscribe(isRepoLoaded => {
        if (!isRepoLoaded) {
          this.router.navigate(['']);
        }

        this.loadRepository(repository);
      });
    });

    this.activeRepository.pipe(switchMap(
        repository =>
            this.repoGist.sync(repository)
                .pipe(take(1), tap(() => this.saveConfigChangesToGist(repository, this.store)))));
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
    this.store.dispatch(new SetName({repository}));
    this.store.dispatch(new LoadContributors({repository}));
    this.store.dispatch(new LoadDashboards({repository}));
    this.store.dispatch(new LoadItems({repository}));
    this.store.dispatch(new LoadLabels({repository}));
    this.store.dispatch(new LoadQueries({repository}));
    this.store.dispatch(new LoadRecommendations({repository}));
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
