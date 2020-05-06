import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSource, Filterer, Grouper, Sorter, Viewer} from '@crafted/data';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {filter, map, mergeMap, shareReplay, switchMap, take, takeUntil} from 'rxjs/operators';
import {Widget} from '@crafted/components';
import {Github} from '../../service/github';

import {isMobile} from '../../utility/media-matcher';
import {Query, QueryView} from '../model/query';
import {DATA_RESOURCES_MAP, DataResources} from '../repository';
import {ItemDetailDialog} from '../shared/dialog/item-detail-dialog/item-detail-dialog';
import {QueryDialog} from '../shared/dialog/query/query-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';
import {AppState} from '../store';
import {UpdateItemsFromGithub} from '../store/item/item.action';
import {selectItemById} from '../store/item/item.reducer';
import {selectRepositoryName} from '../store/name/name.reducer';
import {CreateQuery} from '../store/query/query.action';
import {selectQueryById} from '../store/query/query.reducer';

interface QueryResources {
  loading: Observable<boolean>;
  viewer: Viewer;
  filterer: Filterer;
  grouper: Grouper;
  sorter: Sorter;
  dataSource: DataSource;
}

type QueryPageHeaderAction = 'save'|'saveAs'|'table-view'|'list-view';

const NEW_QUERY_HEADER_ACTIONS: HeaderContentAction<QueryPageHeaderAction>[] = [
  {
    id: 'saveAs',
    isPrimary: true,
    text: 'Save Query As',
  },
];

const SET_TABLE_VIEW_ACTION: HeaderContentAction<QueryPageHeaderAction> = {
  id: 'table-view',
  icon: 'view_headline',
  tooltip: 'Show table view'
};


const SET_LIST_VIEW_ACTION: HeaderContentAction<QueryPageHeaderAction> = {
  id: 'list-view',
  icon: 'vertical_split',
  tooltip: 'Show list view',
};

@Component({
  styleUrls: ['query-page.scss'],
  templateUrl: 'query-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.is-mobile]': 'isMobile()'}
})
export class QueryPage {
  isMobile = isMobile;

  dataResourceOptions: {id: string, label: string}[];

  query = new ReplaySubject<Query>(1);

  view = new ReplaySubject<QueryView>(1);

  queryResources: Observable<QueryResources> = this.query.pipe(
      map(query => {
        if (query.dataType) {
          const dataResource = this.dataResourcesMap.get(query.dataType);
          return {
            loading: dataResource.loading,
            viewer: dataResource.viewer(this.view, query.viewerState),
            filterer: dataResource.filterer(query.filtererState),
            grouper: dataResource.grouper(query.grouperState),
            sorter: dataResource.sorter(query.sorterState),
            dataSource: dataResource.dataSource()
          };
        }
      }),
      filter(v => !!v), shareReplay(1));

  canSave = combineLatest(this.query, this.queryResources, this.view)
                .pipe(mergeMap(([query, queryResources, view]) => {
                  return combineLatest(
                             of(query.view === view),
                             queryResources.viewer.isEquivalent(query.viewerState),
                             queryResources.filterer.isEquivalent(query.filtererState),
                             queryResources.grouper.isEquivalent(query.grouperState),
                             queryResources.sorter.isEquivalent(query.sorterState))
                      .pipe(map(equivalent => equivalent.some(r => !r)));
                }));

  itemId$ = this.activatedRoute.queryParamMap.pipe(map(queryParamMap => queryParamMap.get('item')));

  item$ = this.itemId$.pipe(mergeMap(itemId => this.store.select(selectItemById(itemId))));

  headerActions: Observable<HeaderContentAction[]> =
      combineLatest(this.query, this.canSave, this.view).pipe(map(([query, canSave, view]) => {
        const setViewAction = view === 'list' ? SET_TABLE_VIEW_ACTION : SET_LIST_VIEW_ACTION;

        if (!query.id) {
          return [setViewAction, ...NEW_QUERY_HEADER_ACTIONS];
        }

        return [
          setViewAction, {
            id: 'save',
            isPrimary: true,
            isDisabled: !canSave,
            text: 'Save',
          }
        ];
      }));

  listWidth = 500;

  destroyed = new Subject();

  constructor(
      private store: Store<AppState>, private github: Github,
      @Inject(DATA_RESOURCES_MAP) public dataResourcesMap: Map<string, DataResources>,
      private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
      private queryDialog: QueryDialog) {
    this.dataResourceOptions = [];
    this.dataResourcesMap.forEach(
        dataResource =>
            this.dataResourceOptions.push({id: dataResource.type, label: dataResource.label}));

    this.activatedRoute.params
        .pipe(
            mergeMap(
                params => (params.id !== 'new') ?
                    this.store.select(selectQueryById(params.id)).pipe(filter(query => !!query)) :
                    this.newQuery()),
            takeUntil(this.destroyed))
        .subscribe(query => {
          this.query.next(query);
          this.view.next(query.view || 'list');
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
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
    const currentState = this.queryResources.pipe(
        mergeMap(
            resources => combineLatest(
                resources.filterer.state, resources.grouper.state, resources.sorter.state,
                resources.viewer.state)),
        take(1));

    combineLatest(this.query, currentState, this.view).pipe(take(1)).subscribe(([
                                                                                 query, state, view
                                                                               ]) => {
      const states = {
        filtererState: state[0],
        grouperState: state[1],
        sorterState: state[2],
        viewerState: state[3],
      };
      this.store.dispatch(new CreateQuery({query: {...query, ...states, name, group, view}}));
    });
  }

  navigateToItem(id: string) {
    this.store.select(selectRepositoryName)
        .pipe(take(1), switchMap(repository => this.github.getItem(repository, id)))
        .subscribe(item => {
          this.store.dispatch(new UpdateItemsFromGithub({items: [item]}));
        });


    if (!isMobile()) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute.parent,
        queryParams: {item: id},
        replaceUrl: true,
        queryParamsHandling: 'merge',
      });
    } else {
      this.dialog.open(ItemDetailDialog, {data: {itemId: id}});
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
      case 'table-view':
        this.view.next('table');
        break;
      case 'list-view':
        this.view.next('list');
        break;
    }
  }

  createQueryWithType(dataType: string) {
    this.query.pipe(take(1)).subscribe(query => {
      query.dataType = dataType;
      query.viewerState = {views: this.dataResourcesMap.get(dataType).defaultViews};
      this.query.next({...query});
    });
  }

  newQuery(): Observable<Query> {
    return this.activatedRoute.queryParamMap.pipe(
        mergeMap(queryParamMap => {
          const query = JSON.parse(queryParamMap.get('query')) as Query;
          if (query) {
            return of(query);
          }

          const widget = JSON.parse(queryParamMap.get('widget')) as Widget;
          if (widget) {
            const dataType = widget.options.dataType;
            return of({
              name: widget.title,
              viewerState: {views: this.dataResourcesMap.get(dataType).defaultViews},
              ...widget.options
            });
          }

          return of({name: 'New Query', view: 'list'} as Query);
        }),
        take(1));
  }
}
