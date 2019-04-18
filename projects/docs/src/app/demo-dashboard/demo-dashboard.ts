import {Component} from '@angular/core';
import {
  Dashboard,
  getCountWidgetConfig,
  getListWidgetConfig,
  getPieChartWidgetConfig,
  getTimeSeriesWidgetConfig,
  WidgetConfig
} from '@crafted/components';
import {DataResources, DataSource, Filterer, Grouper, Sorter, Viewer} from '@crafted/data';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleDataSourceMetadata} from '../data-resources/data-source-metadata';
import {ExampleFiltererMetadata} from '../data-resources/filterer-metadata';
import {ExampleGrouperMetadata} from '../data-resources/grouper-metadata';
import {ExampleSorterMetadata} from '../data-resources/sorter-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';
import {getBarChartWidgetConfig} from './bar-chart/bar-chart';


@Component({
  selector: 'demo-dashboard',
  templateUrl: 'demo-dashboard.html',
  styleUrls: ['demo-dashboard.scss'],
})
export class DemoDashboard {
  edit = true;

  dashboard: Dashboard = {
    name: 'New Dashboard',
    columnGroups: [{
      columns: [
        {widgets: []},
        {widgets: []},
        {widgets: []},
      ]
    }]
  };

  dataResourcesMap = new Map<string, DataResources>([
    [
      'issue', {
        id: 'issue',
        label: 'Issues',
        dataSource: () =>
            new DataSource({data: EXAMPLE_ITEMS, metadata: ExampleDataSourceMetadata}),
        viewer: initialState => new Viewer({metadata: ExampleViewerMetadata, initialState}),
        filterer: initialState => new Filterer({metadata: ExampleFiltererMetadata, initialState}),
        grouper: initialState => new Grouper({metadata: ExampleGrouperMetadata, initialState}),
        sorter: initialState => new Sorter({metadata: ExampleSorterMetadata, initialState}),
      }
    ],
  ]);

  widgetConfigs: {[key in string]: WidgetConfig<any>} = {
    count: getCountWidgetConfig(this.dataResourcesMap),
    list: getListWidgetConfig(this.dataResourcesMap),
    pie: getPieChartWidgetConfig(this.dataResourcesMap),
    timeSeries: getTimeSeriesWidgetConfig(this.dataResourcesMap),
    bar: getBarChartWidgetConfig(this.dataResourcesMap)
  };
}
