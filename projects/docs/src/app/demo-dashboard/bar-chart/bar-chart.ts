import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MaterialColors, WIDGET_DATA, WidgetConfig, WidgetData} from '@crafted/components';
import {DataSource, Filterer, FiltererState, Grouper, GrouperState} from '@crafted/data';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {EditBarChart} from './edit-bar-chart';


export type BarChartDataResourcesMap = Map<string, {
  id: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  grouper: (initialValue?: GrouperState) => Grouper,
  dataSource: () => DataSource,
}>;

export interface BarChartWidgetDataConfig {
  dataResourcesMap: BarChartDataResourcesMap;
}

export interface BarChartDisplayTypeOptions {
  dataSourceType: string;
  grouperState: GrouperState;
  filteredGroups: string;
  filtererState: FiltererState;
}

export function getBarChartWidgetConfig(dataResourcesMap: BarChartDataResourcesMap):
    WidgetConfig<BarChartWidgetDataConfig> {
  return {
    id: 'bar',
    label: 'Bar Chart',
    component: BarChart,
    editComponent: EditBarChart,
    config: {dataResourcesMap}
  };
}

@Component({
  selector: 'bar-chart',
  template: `
    <ngx-charts-bar-vertical
      [scheme]="colorScheme"
      [results]="data | async"
      [gradient]="gradient"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      (select)="onSelect($event)">
    </ngx-charts-bar-vertical>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  private destroyed = new Subject();

  data: Observable<any[]>

  constructor(@Inject(WIDGET_DATA) public widgetData:
                  WidgetData<BarChartDisplayTypeOptions, BarChartWidgetDataConfig>) {}

  ngOnInit() {
    const config = this.widgetData.config;
    const options = this.widgetData.options;

    const dataSourceProvider = config.dataResourcesMap.get(options.dataSourceType)!;
    const filterer = dataSourceProvider.filterer(options.filtererState);
    const grouper = dataSourceProvider.grouper(options.grouperState);
    const dataSource = dataSourceProvider.dataSource();

    this.data = dataSource.data.pipe(
        filterer.filter(), grouper.group(), map(groups => {
          let filteredGroupsSet: Set<string>;

          if (this.widgetData.options.filteredGroups) {
            filteredGroupsSet = new Set<string>(
                this.widgetData.options.filteredGroups.split(',').map(v => v.trim()));
          }
          return groups.filter(g => filteredGroupsSet ? filteredGroupsSet.has(g.title) : true)
              .map(group => ({name: group.title, value: group.items.length}));
        }));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  single: any[];
  multi: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {domain: MaterialColors};

  onSelect(event) {
    console.log(event);
  }
}
