import {ChangeDetectionStrategy, Component, ElementRef, Inject} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {getPieChartWidgetConfig, getTimeSeriesWidgetConfig} from '@crafted/chartjs-widgets';
import {
  Dashboard,
  getCountWidgetConfig,
  getListWidgetConfig,
  hasWidgets,
  ListDataResourcesMap,
  SavedFiltererState,
  Widget,
  WidgetConfig
} from '@crafted/components';
import {ViewerState} from '@crafted/data';
import {Store} from '@ngrx/store';
import * as Chart from 'chart.js';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {filter, map, mergeMap, take, takeUntil} from 'rxjs/operators';

import {Item} from '../../github/app-types/item';
import {ViewType} from '../../github/data-source/item-viewer-metadata';
import {selectIsDarkTheme} from '../../store/theme/theme.reducer';
import {Query} from '../model/query';
import {Recommendation} from '../model/recommendation';
import {DATA_RESOURCES_MAP as DATA_RESOURCES_MAP, DataResources} from '../repository';
import {ItemDetailDialog} from '../shared/dialog/item-detail-dialog/item-detail-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';
import {AppState} from '../store';
import {UpsertDashboards} from '../store/dashboard/dashboard.action';
import {selectDashboardById} from '../store/dashboard/dashboard.reducer';
import {selectQueryList} from '../store/query/query.reducer';
import {selectRecommendations} from '../store/recommendation/recommendation.reducer';

@Component({
  selector: 'dashboard-page',
  styleUrls: ['dashboard-page.scss'],
  templateUrl: 'dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  savedFiltererStates =
      combineLatest(this.store.select(selectQueryList), this.store.select(selectRecommendations))
          .pipe(map(
              ([queries, recommendations]) => getSavedFiltererStates(queries, recommendations)));

  dashboard: Observable<Dashboard> = this.activatedRoute.params.pipe(
      map(params => params.id), mergeMap(id => this.store.select(selectDashboardById(id))));

  edit = new BehaviorSubject<boolean>(false);

  headerActions: Observable<HeaderContentAction[]> = this.edit.pipe(map(edit => {
    return [{
      id: 'toggleEdit',
      isPrimary: edit,
      text: edit ? 'View' : 'Edit',
    }];
  }));

  widgetConfigs: {[key in string]: WidgetConfig<any>} = {
    count: getCountWidgetConfig(this.dataResourcesMap, this.savedFiltererStates),
    list: getListWidgetConfig(
        convertToListDataResourcesMap(this.dataResourcesMap),
        (item: Item) => {
          this.dialog.open(ItemDetailDialog, {data: {itemId: item.id}, width: '80vw'});
        },
        this.savedFiltererStates),
    pie: getPieChartWidgetConfig(this.dataResourcesMap, this.savedFiltererStates),
    timeSeries: getTimeSeriesWidgetConfig(this.dataResourcesMap, this.savedFiltererStates),
  };

  destroyed = new Subject();

  constructor(
      private store: Store<AppState>, private dialog: MatDialog, private elementRef: ElementRef,
      @Inject(DATA_RESOURCES_MAP) public dataResourcesMap: Map<string, DataResources>,
      private router: Router, private activatedRoute: ActivatedRoute) {
    this.store.select(selectIsDarkTheme).pipe(takeUntil(this.destroyed)).subscribe(isDarkTheme => {
      Chart.defaults.global.defaultFontColor = isDarkTheme ? 'white' : 'black';
    });

    this.dashboard.pipe(filter(d => !!d), take(1))
        .subscribe(dashboard => this.edit.next(!hasWidgets(dashboard)));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  trackByIndex = (i: number) => i;

  saveDashboard(dashboard: Dashboard) {
    this.store.dispatch(new UpsertDashboards({dashboards: [dashboard]}));
  }

  openQuery(widget: Widget) {
    this.router.navigate(
        [`../../query/new`],
        {queryParams: {widget: JSON.stringify(widget)}, relativeTo: this.activatedRoute.parent});
  }

  fullscreen() {
    this.elementRef.nativeElement.requestFullscreen();
  }

  handleHeaderAction(action: string) {
    if (action === 'toggleEdit') {
      this.edit.pipe(take(1)).subscribe(edit => this.edit.next(!edit));
    }
  }
}

function getSavedFiltererStates(queries: Query[], recommendations: Recommendation[]) {
  const savedFiltererStates: SavedFiltererState[] = [];

  queries.forEach(query => savedFiltererStates.push({
    state: query.filtererState,
    label: query.name,
    group: 'Queries',
    dataType: query.dataType,
  }));

  recommendations.forEach(recommendation => savedFiltererStates.push({
    state: recommendation.filtererState,
    label: recommendation.message,
    group: 'Recommendations',
    dataType: recommendation.dataType
  }));

  return savedFiltererStates;
}

function convertToListDataResourcesMap(dataResourcesMap: Map<string, DataResources>):
    ListDataResourcesMap {
  const listDataResourcesMap: ListDataResourcesMap = new Map();
  dataResourcesMap.forEach((value, key) => {
    listDataResourcesMap.set(key, {
      type: value.type,
      label: value.label,
      filterer: value.filterer,
      sorter: value.sorter,
      viewer: (initialValue?: ViewerState) => value.viewer(of('list' as ViewType), initialValue),
      dataSource: value.dataSource
    });
  });
  return listDataResourcesMap;
}
