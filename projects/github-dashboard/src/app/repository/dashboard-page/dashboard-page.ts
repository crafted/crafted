import {ChangeDetectionStrategy, Component, ElementRef, Inject} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Dashboard,
  getCountWidgetConfig,
  getListWidgetConfig,
  getPieChartWidgetConfig,
  getTimeSeriesWidgetConfig,
  hasWidgets,
  SavedFiltererState,
  Widget,
  WidgetConfig
} from '@crafted/components';
import {DataResources} from '@crafted/data';
import * as Chart from 'chart.js';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map, mergeMap, shareReplay, take} from 'rxjs/operators';
import {Item} from '../../github/app-types/item';
import {DATA_RESOURCES_MAP as DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {Query} from '../services/dao/config/query';
import {Recommendation} from '../services/dao/config/recommendation';
import {Theme} from '../services/theme';
import {ItemDetailDialog} from '../shared/dialog/item-detail-dialog/item-detail-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';

@Component({
  selector: 'dashboard-page',
  styleUrls: ['dashboard-page.scss'],
  templateUrl: 'dashboard-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  savedFiltererStates = this.activeStore.config.pipe(
      mergeMap(config => combineLatest(config.queries.list, config.recommendations.list)),
    map(result => getSavedFiltererStates(result[0], result[1])));

  dashboard: Observable<Dashboard> =
    combineLatest(this.activeStore.config, this.activatedRoute.params)
      .pipe(mergeMap(results => results[0].dashboards.get(results[1].id)), shareReplay(1));

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
        this.dataResourcesMap,
        (item: Item) => {
          this.dialog.open(ItemDetailDialog, {data: {itemId: item.id}, width: '80vw'});
        },
        this.savedFiltererStates),
    pie: getPieChartWidgetConfig(this.dataResourcesMap, this.savedFiltererStates),
    timeSeries: getTimeSeriesWidgetConfig(this.dataResourcesMap, this.savedFiltererStates),
  };

  constructor(
    private dialog: MatDialog, private elementRef: ElementRef,
    @Inject(DATA_RESOURCES_MAP) public dataResourcesMap: Map<string, DataResources>,
    private router: Router, private activatedRoute: ActivatedRoute, private theme: Theme,
    private activeStore: ActiveStore) {
    // TODO: Needs to listen for theme changes to know when this should change
    Chart.defaults.global.defaultFontColor = this.theme.isLight ? 'black' : 'white';

    this.dashboard.pipe(take(1)).subscribe(dashboard => this.edit.next(!hasWidgets(dashboard)));
  }

  trackByIndex = (i: number) => i;

  saveDashboard(dashboard: Dashboard) {
    this.activeStore.config.pipe(take(1)).subscribe(configStore => {
      configStore.dashboards.update(dashboard);
    });
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
