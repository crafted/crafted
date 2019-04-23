import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MaterialColors, WIDGET_DATA, WidgetConfig, WidgetData} from '@crafted/components';
import {DataSource, Filterer, FiltererState, Group, Grouper, GrouperState} from '@crafted/data';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {BarChartEdit} from './bar-chart-edit';


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

export interface BarChartOptions {
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
    editComponent: BarChartEdit,
    config: {dataResourcesMap}
  };
}

@Component({
  selector: 'bar-chart',
  template: `
    <ngx-charts-bar-vertical
      [scheme]="colorScheme"
      [results]="data | async"
      [xAxis]="true"
      [yAxis]="true"
      [legend]="true">
    </ngx-charts-bar-vertical>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  data: Observable<any[]>

  constructor(@Inject(WIDGET_DATA) public widgetData:
                  WidgetData<BarChartOptions, BarChartWidgetDataConfig>) {}

  ngOnInit() {
    const config = this.widgetData.config;
    const options = this.widgetData.options;

    const dataSourceProvider = config.dataResourcesMap.get(options.dataSourceType)!;
    const filterer = dataSourceProvider.filterer(options.filtererState);
    const grouper = dataSourceProvider.grouper(options.grouperState);
    const dataSource = dataSourceProvider.dataSource();

    this.data = dataSource.data.pipe(
        filterer.filter(), grouper.group(),
        transformGroupsToBarChartData(this.widgetData.options.filteredGroups));
  }

  colorScheme = {domain: MaterialColors};
}

function transformGroupsToBarChartData(filteredGroups: string):
    (itemGroups: Observable<Group<any>[]>) => Observable<{name: string, value: number}[]> {
  return (itemGroups$: Observable<Group<any>[]>) => {
    return itemGroups$.pipe(map(itemGroups => {
      if (filteredGroups) {
        const filteredGroupsSet = new Set<string>(filteredGroups.split(',').map(v => v.trim()));
        itemGroups = itemGroups.filter(g => filteredGroupsSet.has(g.title));
      }

      return itemGroups.map(group => ({name: group.title, value: group.items.length}));
    }));
  }
}
