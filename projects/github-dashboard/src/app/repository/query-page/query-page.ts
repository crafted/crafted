import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {DataResources, DataSource, Filterer, Grouper, Sorter, Viewer} from '@crafted/data';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {filter, map, mergeMap, shareReplay, take} from 'rxjs/operators';
import {AppState} from '../../store';
import {GitHubUpdateItem} from '../../store/github/github.actions';
import {isMobile} from '../../utility/media-matcher';
import {Query} from '../model/query';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {PageNavigator} from '../services/page-navigator';
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

type QueryPageHeaderAction = 'save'|'saveAs';

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
export class QueryPage {
  isMobile = isMobile;

  dataResourceOptions: {id: string, label: string}[];

  query: Observable<Query> = combineLatest(this.activatedRoute.params, this.activeStore.state)
                                 .pipe(
                                     mergeMap(([params, repoState]) => {
                                       if (params.id !== 'new') {
                                         return repoState.queriesDao.get(params.id);
                                       }

                                       return this.newQuery();
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

  canSave =
      combineLatest(this.query, this.queryResources).pipe(mergeMap(([query, queryResources]) => {
        return combineLatest(
                   queryResources.viewer.isEquivalent(query.viewerState),
                   queryResources.filterer.isEquivalent(query.filtererState),
                   queryResources.grouper.isEquivalent(query.grouperState),
                   queryResources.sorter.isEquivalent(query.sorterState))
            .pipe(map(equivalent => equivalent.some(r => !r)));
      }));

  itemId$ = this.activatedRoute.queryParamMap.pipe(map(queryParamMap => queryParamMap.get('item')));

  item$ = combineLatest(this.itemId$, this.store.select(s => s.items))
              .pipe(map(([itemId, itemsState]) => itemsState.entities[itemId]));

  headerActions: Observable<HeaderContentAction[]> =
      combineLatest(this.query, this.canSave).pipe(map(([query, canSave]) => {
        if (!query.id) {
          return NEW_QUERY_HEADER_ACTIONS;
        }

        return [{
          id: 'save',
          isPrimary: true,
          isDisabled: !canSave,
          text: 'Save',
        }];
      }));

  listWidth = 500;

  constructor(
      private store: Store<AppState>,
      @Inject(DATA_RESOURCES_MAP) public dataResourcesMap: Map<string, DataResources>,
      private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
      private activeStore: ActiveStore, private queryDialog: QueryDialog,
      private pageNavigator: PageNavigator) {
    this.dataResourceOptions = [];
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
    const currentState = this.queryResources.pipe(
        mergeMap(
            resources => combineLatest(
                resources.filterer.state, resources.grouper.state, resources.sorter.state,
                resources.viewer.state)),
        take(1));

    combineLatest(this.query, currentState, this.activeStore.state)
        .pipe(
            mergeMap(([query, state, repoState]) => {
              const states = {
                filtererState: state[0],
                grouperState: state[1],
                sorterState: state[2],
                viewerState: state[3],
              };
              const newQuery = {...query, ...states, name, group};
              return repoState.queriesDao.add(newQuery);
            }),
            take(1))
        .subscribe(
            query => this.pageNavigator.navigateToQuery(
                query, {replaceUrl: true, queryParamsHandling: 'merge'}));
  }

  navigateToItem(id: string) {
    this.store.dispatch(new GitHubUpdateItem({id}));

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
    }
  }

  createQueryWithType(dataType: string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {query: JSON.stringify({name: 'New Query', dataType})},
      replaceUrl: true,
      queryParamsHandling: 'merge',
    });
  }

  newQuery(): Observable<Query> {
    return this.activatedRoute.queryParamMap.pipe(
        mergeMap(queryParamMap => {
          const query = queryParamMap.get('query');
          if (query) {
            return of(JSON.parse(query));
          }

          return of();
        }),
        take(1));
  }
}
