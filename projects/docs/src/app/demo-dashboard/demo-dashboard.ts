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
import {EXAMPLE_DATA_SOURCE_METADATA} from '../data-resources/data-source-metadata';
import {EXAMPLE_FILTERER_METADATA} from '../data-resources/filterer-metadata';
import {EXAMPLE_GROUPER_METADATA} from '../data-resources/grouper-metadata';
import {EXAMPLE_SORTER_METADATA} from '../data-resources/sorter-metadata';
import {EXAMPLE_VIEWER_METADATA} from '../data-resources/viewer-metadata';
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
          new DataSource({data: EXAMPLE_ITEMS, metadata: EXAMPLE_DATA_SOURCE_METADATA}),
      viewer: initialState => new Viewer({metadata: EXAMPLE_VIEWER_METADATA, initialState}),
      filterer: initialState => new Filterer({metadata: EXAMPLE_FILTERER_METADATA, initialState}),
      grouper: initialState => new Grouper({metadata: EXAMPLE_GROUPER_METADATA, initialState}),
      sorter: initialState => new Sorter({metadata: EXAMPLE_SORTER_METADATA, initialState}),
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
