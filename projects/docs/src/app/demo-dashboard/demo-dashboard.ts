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
import {of} from 'rxjs';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleDataSourceMetadata} from '../data-resources/data-source-metadata';
import {ExampleFiltererMetadata} from '../data-resources/filterer-metadata';
import {ExampleGrouperMetadata} from '../data-resources/grouper-metadata';
import {ExampleSorterMetadata} from '../data-resources/sorter-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


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

  setDashboard(dashboard: Dashboard) {
    this.dashboard = dashboard;
    console.log(dashboard);
  }

  dataResourcesMap = new Map<string, DataResources>([
    [
      'issue', {
        id: 'issue',
        label: 'Issues',
        dataSource: () => new DataSource(EXAMPLE_ITEMS, ExampleDataSourceMetadata),
        viewer: state => new Viewer(ExampleViewerMetadata, of(() => null), state),
        filterer: state => new Filterer(ExampleFiltererMetadata, of(null), state),
        grouper: state => new Grouper(ExampleGrouperMetadata, of(null), state),
        sorter: state => new Sorter(ExampleSorterMetadata, of(null), state),
      }
    ],
  ]);

  widgetConfigs: {[key in string]: WidgetConfig<any>} = {
    count: getCountWidgetConfig(this.dataResourcesMap),
    list: getListWidgetConfig(this.dataResourcesMap),
    pie: getPieChartWidgetConfig(this.dataResourcesMap),
    timeSeries: getTimeSeriesWidgetConfig(this.dataResourcesMap),
  };
}
