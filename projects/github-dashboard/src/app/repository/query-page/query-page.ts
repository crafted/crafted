import {CdkPortal} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Widget} from '@crafted/components';
import {DataResources, DataSource, Filterer, Grouper, Sorter, Viewer} from '@crafted/data';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {Item} from '../../github/app-types/item';
import {isMobile} from '../../utility/media-matcher';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {ConfigStore} from '../services/dao/config/config-dao';
import {Query} from '../services/dao/config/query';
import {Header} from '../services/header';
import {ItemDetailDialog} from '../shared/dialog/item-detail-dialog/item-detail-dialog';
import {QueryDialog} from '../shared/dialog/query/query-dialog';

@Component({
  styleUrls: ['query-page.scss'],
  templateUrl: 'query-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.is-mobile]': 'isMobile()'}
})
export class QueryPage<T> {
  isMobile = isMobile;

  filterer: Filterer<T>;

  grouper: Grouper<T>;

  sorter: Sorter<T>;

  dataSource: DataSource<T>;

  viewer: Viewer<T, any, any>;

  set query(query: Query) {
    this._query = query;

    const type = this._query.dataSourceType!;
    const dataResource = this.dataResourcesMap.get(type)!;
    this.viewer = dataResource.viewer(this.query.viewerState);
    this.filterer = dataResource.filterer(this.query.filtererState);
    this.grouper = dataResource.grouper(this.query.grouperState);
    this.sorter = dataResource.sorter(this.query.sorterState);
    this.dataSource = dataResource.dataSource();

    this.canSave = combineLatest(
                       this.viewer.isEquivalent(query.viewerState),
                       this.filterer.isEquivalent(query.filtererState),
                       this.grouper.isEquivalent(query.grouperState),
                       this.sorter.isEquivalent(query.sorterState))
                       .pipe(map(results => results.some(result => !result)));

    this.activeItem = combineLatest(this.dataSource.data, this.itemId).pipe(map(results => {
      // TODO: Cannot assume this is Item
      for (let item of results[0]) {
        if ((item as any as Item).id === results[1]) {
          return item;
        }
      }
      return null;
    }));

    this.header.title.next(this.query.name || '');
    this.header.goBack = true;
  }
  get query(): Query {
    return this._query;
  }
  private _query: Query;

  itemId =
      this.activatedRoute.queryParamMap.pipe(map(queryParamsMap => queryParamsMap.get('item')));

  private destroyed = new Subject();
  private getSubscription: Subscription;

  public canSave: Observable<boolean>;

  public activeItem: Observable<T|null>;

  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  constructor(
      @Inject(DATA_RESOURCES_MAP) public dataResourcesMap: Map<string, DataResources>,
      private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute,
      private activeRepo: ActiveStore, private header: Header, private queryDialog: QueryDialog,
      private cd: ChangeDetectorRef) {
    this.activatedRoute.params.pipe(takeUntil(this.destroyed)).subscribe(params => {
      const id = params['id'];

      if (this.getSubscription) {
        this.getSubscription.unsubscribe();
      }

      if (id === 'new') {
        const queryParamMap = this.activatedRoute.snapshot.queryParamMap;
        const recommendationId = queryParamMap.get('recommendationId');
        const widgetJson = queryParamMap.get('widget');

        if (recommendationId) {
          this.createNewQueryFromRecommendation(this.activeRepo.activeConfig, recommendationId);
        } else if (widgetJson) {
          // TODO: Figure out how to convert widget into query again
          const widget: Widget = JSON.parse(widgetJson);
          this.query = createNewQuery(widget.title || 'Widget', 'issue');
        } else {
          const type = queryParamMap.get('type') || '';
          this.query = createNewQuery('New Query', type);
        }

        this.cd.markForCheck();
      } else {
        this.getSubscription =
            this.activeRepo.activeConfig.queries.map.pipe(takeUntil(this.destroyed))
                .subscribe(map => {
                  const query = map.get(id);
                  if (query) {
                    this.query = query;
                  }
                  this.cd.markForCheck();
                });
      }
    });
  }

  ngOnInit() {
    this.header.toolbarOutlet.next(this.toolbarActions);
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
    this.destroyed.next();
    this.destroyed.complete();
  }

  openSaveAsDialog() {
    const queryType = this.query.dataSourceType;
    if (!queryType) {
      throw Error('Missing query type');
    }
    this.queryDialog.saveAsQuery().pipe(take(1)).subscribe(
        result => this.saveAs(result.name, result.group));
  }

  saveState() {
    combineLatest(this.filterer.state, this.grouper.state, this.sorter.state, this.viewer.state)
        .pipe(take(1))
        .subscribe(results => {
          const queryState = {
            filtererState: results[0],
            grouperState: results[1],
            sorterState: results[2],
            viewerState: results[3],
          };

          this.activeRepo.activeConfig.queries.update({...this.query, ...queryState});
        });
  }

  saveAs(name: string, group: string) {
    this.query = {...this.query, name, group};
    const store = this.activeRepo.activeConfig;
    const newQueryId = store.queries.add(this.query);

    this.saveState();

    this.router.navigate(
        [`${this.activeRepo.activeData.name}/query/${newQueryId}`],
        {replaceUrl: true, queryParamsHandling: 'merge'});
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

  private createNewQueryFromRecommendation(store: ConfigStore, id: string) {
    store.recommendations.list.pipe(take(1)).subscribe(list => {
      list.forEach(r => {
        if (r.id === id) {
          this.query = createNewQuery('New Query', 'issue');
          if (r.filtererState) {
            this.filterer.setState(r.filtererState);
          }
          this.cd.markForCheck();
        }
      });
    });
  }
}

function createNewQuery(name: string, dataSourceType: string): Query {
  return {name, dataSourceType};
}
