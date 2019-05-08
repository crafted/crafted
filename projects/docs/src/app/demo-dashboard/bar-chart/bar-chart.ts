import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MATERIAL_COLORS, WIDGET_DATA, WidgetConfig, WidgetData} from '@crafted/components';
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
  dataType: string;
  grouperState: GrouperState;
  filteredGroups: string;
  filtererState: FiltererState;
}

@Component({
  selector: 'bar-chart',
  template: `
    <chartjs-bar-vertical
      [scheme]="colorScheme"
      [results]="data | async"
      [xAxis]="true"
      [yAxis]="true"
      [legend]="true">
    </chartjs-bar-vertical>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  data: Observable<any[]>;

  colorScheme = {domain: MATERIAL_COLORS};

  constructor(@Inject(WIDGET_DATA) public widgetData:
                  WidgetData<BarChartOptions, BarChartWidgetDataConfig>) {}

  ngOnInit() {
    const config = this.widgetData.config;
    const options = this.widgetData.options;

    const dataSourceProvider = config.dataResourcesMap.get(options.dataType);
    if (!dataSourceProvider) {
      throw Error(`Missing data source provider for type ${options.dataType}`);
    }

    const filterer = dataSourceProvider.filterer(options.filtererState);
    const grouper = dataSourceProvider.grouper(options.grouperState);
    const dataSource = dataSourceProvider.dataSource();

    this.data = dataSource.data.pipe(
        filterer.filter(), grouper.group(),
        transformGroupsToBarChartData(this.widgetData.options.filteredGroups));
  }
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
  };
}

export function getBarChartWidgetConfig(dataResourcesMap: BarChartDataResourcesMap):
  WidgetConfig<BarChartWidgetDataConfig> {
  return {
    id: 'bar',
    label: 'Bar Chart',
    viewer: BarChart,
    editor: BarChartEdit,
    config: {dataResourcesMap}
  };
}
