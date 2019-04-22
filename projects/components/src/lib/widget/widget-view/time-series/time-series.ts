import {ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {DataSource, Filterer, FiltererState} from '@crafted/data';
import * as Chart from 'chart.js';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {WIDGET_DATA, WidgetConfig, WidgetData} from '../../widget';
import {SavedFiltererState} from '../../widget-edit/widget-edit';
import {MaterialColors} from '../widget-view';

import {TimeSeriesEdit} from './time-series-edit';


export type TimeSeriesDataResourcesMap = Map<string, {
  id: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  dataSource: () => DataSource,
}>;

export interface TimeSeriesWidgetDataConfig {
  dataResourcesMap: TimeSeriesDataResourcesMap;
  savedFiltererStates: Observable<SavedFiltererState[]>;
}

export function getTimeSeriesWidgetConfig(
    dataResourcesMap: TimeSeriesDataResourcesMap,
    savedFiltererStates: Observable<SavedFiltererState[]> =
        of([])): WidgetConfig<TimeSeriesWidgetDataConfig> {
  return {
    id: 'timeSeries',
    label: 'Time Series',
    component: TimeSeries,
    editComponent: TimeSeriesEdit,
    config: {dataResourcesMap, savedFiltererStates}
  };
}

interface DateCount {
  date: string;
  count: number;
}

interface TimeSeriesData {
  x: string;
  y: number;
}

type ActionType = 'increment'|'decrement';

interface DateActionPair {
  date: string;
  actionType: ActionType;
}

export interface DatasetConfigAction {
  datePropertyId: string;
  type: ActionType;
}

export interface DatasetConfig {
  label: string;
  color: string;
  seriesType: 'count'|'accumulate';
  actions: DatasetConfigAction[];
  dataSourceType: string;
  filtererState: FiltererState;
}

export interface TimeSeriesDisplayTypeOptions {
  start: string;
  end: string;
  group: 'day'|'week'|'month';
  datasets: DatasetConfig[];
}

@Component({
  selector: 'time-series',
  template: `<canvas #canvas></canvas>`,
  styleUrls: ['time-series.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeries<T> {
  chart: Chart;

  @ViewChild('canvas') canvas: ElementRef;

  private destroyed = new Subject();

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<TimeSeriesDisplayTypeOptions, TimeSeriesWidgetDataConfig>) {}

  ngOnInit() {
    const datasetData = this.data.options.datasets.map(datasetConfig => {
      const dataSourceProvider =
          this.data.config.dataResourcesMap.get(datasetConfig.dataSourceType)!;
      const filterer = dataSourceProvider.filterer(datasetConfig.filtererState);
      const dataSource = dataSourceProvider.dataSource();
      return dataSource.data.pipe(filterer.filter());
    });

    combineLatest(datasetData).pipe(takeUntil(this.destroyed)).subscribe(results => {
      return this.render(results);
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private render(items: T[][]) {
    const datasets: Chart.ChartDataSets[] =
        this.data.options.datasets.map((datasetConfig, index: number) => {
          return {
            label: datasetConfig.label,
            data: this.createData(items[index], datasetConfig),
            fill: false,
            borderColor: datasetConfig.color || MaterialColors[index],
          };
        });

    const time: Chart.TimeScale = {
      min: this.data.options.start,
      max: this.data.options.end,
      tooltipFormat: 'll'
    };

    if (!this.chart) {
      this.createChart(datasets, time);
    } else {
      this.updateChart(datasets, time);
    }
  }

  private createChart(datasets: Chart.ChartDataSets[], time: Chart.TimeScale) {
    const config: Chart.ChartConfiguration = {
      type: 'line',
      data: {datasets},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {display: datasets.length > 1},
        elements: {point: {radius: 2}, line: {tension: 0}},
        scales: {
          xAxes: [{type: 'time', time, scaleLabel: {display: true, labelString: 'Date'}}],
          yAxes: [{scaleLabel: {display: true, labelString: 'value'}}]
        }
      }
    };
    this.chart = new Chart(this.canvas.nativeElement, config);
    this.chart.render();
  }

  private updateChart(datasets: Chart.ChartDataSets[], time: Chart.TimeScale) {
    // Remove animations since dataset changes can cause weird glitching
    this.chart.config.options!.animation!.duration = 0;
    this.chart.data.datasets = datasets;
    this.chart.config.options!.scales!.xAxes![0].time = time;
    this.chart.update();
  }

  private getDateCounts(dateActionPairs: DateActionPair[]): DateCount[] {
    const dateCountsMap = new Map<string, number>();

    dateActionPairs.forEach(pair => {
      const date = pair.date;
      const actionType = pair.actionType;

      if (!dateCountsMap.has(date)) {
        dateCountsMap.set(date, 0);
      }

      let count = dateCountsMap.get(date)!;
      switch (actionType) {
        case 'increment':
          dateCountsMap.set(date, count + 1);
          break;
        case 'decrement':
          dateCountsMap.set(date, count - 1);
          break;
      }
    });

    const dateCounts: DateCount[] = [];
    dateCountsMap.forEach((count, date) => dateCounts.push({count, date}));
    dateCounts.sort((a, b) => a.date < b.date ? -1 : 1);
    return dateCounts;
  }

  private roundDate(dateStr = ''): string {
    if (!dateStr) {
      return '';
    }

    switch (this.data.options.group) {
      case 'day':
        return dateStr.substring(0, 10);
      case 'month':
        return dateStr.substring(0, 7) + '-01';
      case 'week':
        const date = new Date(dateStr.substring(0, 10));
        const newDate = date.getDate() - date.getDay();
        return new Date(date.setDate(newDate)).toISOString().substring(0, 10);
    }

    return '';
  }

  private createData(items: T[], datasetConfig: DatasetConfig) {
    const dateActions: DateActionPair[] = [];
    items.forEach(item => {
      datasetConfig.actions.forEach(action => {
        const dataSource =
            this.data.config.dataResourcesMap.get(datasetConfig.dataSourceType)!.dataSource();
        // TODO: Error handling if the property does not exist
        const date = dataSource.getDataProperty(action.datePropertyId, item);
        if (date) {
          dateActions.push({date: this.roundDate(date), actionType: action.type});
        }
      });
    });
    const dateCounts = this.getDateCounts(dateActions);

    let accumulatedCount = 0;
    let data: TimeSeriesData[] = [];
    dateCounts.forEach((dateCount => {
      accumulatedCount += dateCount.count;
      data.push({
        x: dateCount.date,
        y: datasetConfig.seriesType === 'accumulate' ? accumulatedCount : dateCount.count,
      });
    }));

    return data;
  }
}
