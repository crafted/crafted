import {Component} from '@angular/core';
import {DataSource, Grouper, Sorter, Viewer} from '@crafted/data';
import {Filterer} from 'projects/data/src/public-api';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleFiltererMetadata} from '../data-resources/filterer-metadata';
import {ExampleGrouperMetadata} from '../data-resources/grouper-metadata';
import {ExampleSorterMetadata} from '../data-resources/sorter-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-items-list',
  templateUrl: 'demo-items-list.html',
  styleUrls: ['demo-items-list.scss'],
})
export class DemoItemsList {
  dataSource = new DataSource(EXAMPLE_ITEMS);
  viewer = new Viewer(ExampleViewerMetadata);
  grouper = new Grouper(ExampleGrouperMetadata);
  filterer = new Filterer(ExampleFiltererMetadata);
  sorter = new Sorter(ExampleSorterMetadata);
}
