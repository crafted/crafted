import {Component} from '@angular/core';
import {DataResources, DataSource, Filterer, Grouper, Sorter, Viewer} from '@crafted/data';
import {
  getCountWidgetConfig,
  getListWidgetConfig,
  getPieChartWidgetConfig,
  getTimeSeriesWidgetConfig,
  WidgetConfig
} from 'dist/components/lib/widget';
import {Item} from 'projects/github-dashboard/src/app/github/app-types/item';
import {
  ItemDetailDialog
} from
    'projects/github-dashboard/src/app/repository/shared/dialog/item-detail-dialog/item-detail-dialog';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleFiltererMetadata} from '../data-resources/filterer-metadata';
import {ExampleGrouperMetadata} from '../data-resources/grouper-metadata';
import {ExampleSorterMetadata} from '../data-resources/sorter-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-advanced-search',
  templateUrl: 'demo-advanced-search.html',
  styleUrls: ['demo-advanced-search.scss'],
})
export class DemoAdvancedSearch {
  edit = true;

  dataResourcesMap = new Map<string, DataResources>([
    [
      'issue', {
        id: 'issue',
        label: 'Issues',
        dataSource: () => new DataSource(EXAMPLE_ITEMS),
        viewer: () => new Viewer(ExampleViewerMetadata),
        filterer: () => new Filterer(ExampleFiltererMetadata),
        grouper: () => new Grouper(ExampleGrouperMetadata),
        sorter: () => new Sorter(ExampleSorterMetadata),
      }
    ],
  ]);

  widgetConfigs: {[key in string]: WidgetConfig<any>} = {
    count: getCountWidgetConfig(this.dataResourcesMap, []),
    list: getListWidgetConfig(
        this.dataResourcesMap,
        (item: Item) => {
          this.dialog.open(ItemDetailDialog, {data: {itemId: item.id}, width: '80vw'});
        },
        []),
    pie: getPieChartWidgetConfig(this.dataResourcesMap, []),
    timeSeries: getTimeSeriesWidgetConfig(this.dataResourcesMap, []),
  };
}
