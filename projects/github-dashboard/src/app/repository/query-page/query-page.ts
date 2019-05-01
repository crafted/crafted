import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Widget} from '@crafted/components';
import {DataResources, DataSource, Filterer, Grouper, Sorter, Viewer} from '@crafted/data';
import {combineLatest, Observable, of} from 'rxjs';
import {filter, map, mergeMap, shareReplay, take, tap} from 'rxjs/operators';
import {Item} from '../../github/app-types/item';
import {isMobile} from '../../utility/media-matcher';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {ConfigStore} from '../services/dao/config/config-dao';
import {Query} from '../services/dao/config/query';
import {ItemDetailDialog} from '../shared/dialog/item-detail-dialog/item-detail-dialog';
import {QueryDialog} from '../shared/dialog/query/query-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';

interface QueryResources {
  viewer: Viewer;
  filterer: Filterer;
  grouper: Grouper;
  sorter: Sorter;
  dataSource: DataSource;
}

type QueryPageHeaderAction = 'save' | 'saveAs';

const NEW_QUERY_HEADER_ACTIONS: HeaderContentAction<QueryPageHeaderAction>[] = [
  {
    id: 'saveAs',
    isPrimary: true,
    text: 'Save Query As',
  },
];

@Component({
  styleUrls: ['query-page.scss'],
  templateUrl: 'query-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.is-mobile]': 'isMobile()'}
})
export class QueryPage<T> {
  isMobile = isMobile;

  dataResourceOptions: {id: string, label: string}[] = [];

  query: Observable<Query> =
    combineLatest(this.activatedRoute.params, this.activatedRoute.queryParamMap)
      .pipe(
        mergeMap(results => {
          if (results[0].id === 'new') {
            const configStore = this.activeStore.activeConfig;
            return newQuery(results[1], configStore).pipe(tap(query => {
              if (!query.dataType && this.dataResourceOptions.length === 1) {
                query.dataType = this.dataResourceOptions[0].id;
              }
            }));
          }

          return this.activeStore.activeConfig.queries.get(results[0].id);
        }),
        shareReplay(1));

  queryResources: Observable<QueryResources> = this.query.pipe(
    map(query => {
      if (query.dataType) {
        const dataResource = this.dataResourcesMap.get(query.dataType);
        return {
          viewer: dataResource.viewer(query.viewerState),
          filterer: dataResource.filterer(query.filtererState),
          grouper: dataResource.grouper(query.grouperState),
          sorter: dataResource.sorter(query.sorterState),
          dataSource: dataResource.dataSource()
        };
      }
    }),
    filter(v => !!v), shareReplay(1));

  canSave = combineLatest(this.query, this.queryResources).pipe(mergeMap(results => {
    const query = results[0];
    const queryResources = results[1];
    return combineLatest(
      queryResources.viewer.isEquivalent(query.viewerState),
      queryResources.filterer.isEquivalent(query.filtererState),
      queryResources.grouper.isEquivalent(query.grouperState),
      queryResources.sorter.isEquivalent(query.sorterState))
      .pipe(map(equivalent => equivalent.some(r => !r)));
  }));

  itemId =
    this.activatedRoute.queryParamMap.pipe(map(queryParamsMap => queryParamsMap.get('item')));

  activeItem = combineLatest(this.queryResources, this.itemId).pipe(mergeMap(result => {
    return result[0].dataSource.data.pipe(map(data => {
      for (const item of data) {
        if ((item as any as Item).id === result[1]) {
          return item;
        }
      }
    }));
  }));

  headerActions: Observable<HeaderContentAction[]> =
    combineLatest(this.query, this.canSave).pipe(map(results => {
      if (!results[0].id) {
        return NEW_QUERY_HEADER_ACTIONS;
      }

      return [{
        id: 'save',
        isPrimary: true,
        isDisabled: !results[1],
        text: 'Save',
      }];
    }));

  listWidth = 500;

  constructor(
    @Inject(DATA_RESOURCES_MAP) public dataResourcesMap: Map<string, DataResources>,
    private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
    private activeStore: ActiveStore, private queryDialog: QueryDialog) {
    this.dataResourcesMap.forEach(
      dataResource =>
        this.dataResourceOptions.push({id: dataResource.type, label: dataResource.label}));
  }

  openSaveAsDialog() {
    this.queryDialog.saveAsQuery().pipe(take(1)).subscribe(result => {
      if (result) {
        this.saveAs(result.name, result.group);
      }
    });
  }

  save() {
    this.query.pipe(take(1)).subscribe(query => this.saveAs(query.name, query.group));
  }

  saveAs(name: string, group: string) {
    const currentState = this.queryResources
      .pipe(
        mergeMap(
          resources => combineLatest(resources.filterer.state, resources.grouper.state,
            resources.sorter.state, resources.viewer.state)),
        take(1));

    combineLatest(this.query, currentState, this.activeStore.config, this.activeStore.name).pipe(
      mergeMap(results => {
        const state = results[1];
        const configStore = results[2];
        const states = {
          filtererState: state[0],
          grouperState: state[1],
          sorterState: state[2],
          viewerState: state[3],
        };
        const query = {...results[0], ...states, name, group};
        return combineLatest(configStore.queries.add(query), this.activeStore.name);
      }), take(1))
      .subscribe(results => {
        this.router.navigate(
          [`${results[1]}/query/${results[0]}`],
          {replaceUrl: true, queryParamsHandling: 'merge'});
      });
  }

  navigateToItem(itemId: number) {
    if (!isMobile()) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute.parent,
        queryParams: {item: itemId},
        replaceUrl: true,
        queryParamsHandling: 'merge',
      });
    } else {
      this.dialog.open(ItemDetailDialog, {data: {itemId}});
    }
  }

  handleHeaderAction(action: QueryPageHeaderAction) {
    switch (action) {
      case 'save':
        this.save();
        break;
      case 'saveAs':
        this.openSaveAsDialog();
        break;
    }
  }

  createQueryWithType(type: string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {type},
      replaceUrl: true,
      queryParamsHandling: 'merge',
    });
  }
}

function createNewQueryFromRecommendation(store: ConfigStore, id: string) {
  return store.recommendations.get(id).pipe(map(recommendation => {
    const query: Query = {name: recommendation.message, dataType: recommendation.dataType};
    query.filtererState = recommendation.filtererState;
    return query;
  }));
}

function newQuery(queryParamMap: ParamMap, configStore: ConfigStore): Observable<Query> {
  const recommendationId = queryParamMap.get('recommendationId');
  if (recommendationId) {
    return createNewQueryFromRecommendation(configStore, recommendationId);
  }

  const widgetJson = queryParamMap.get('widget');
  if (widgetJson) {
    // TODO: Figure out how to convert widget into query again
    const widget: Widget = JSON.parse(widgetJson);
    return of({name: widget.title || 'Widget', dataType: 'issue'});
  }

  return of({name: 'New Query', dataType: queryParamMap.get('type')});
}
