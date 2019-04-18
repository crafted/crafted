import {Component} from '@angular/core';
import {DataSource, Grouper, Sorter, Viewer} from '@crafted/data';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleGrouperMetadata} from '../data-resources/grouper-metadata';
import {ExampleSorterMetadata} from '../data-resources/sorter-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-display-options',
  templateUrl: 'demo-display-options.html',
  styleUrls: ['demo-display-options.scss'],
})
export class DemoDisplayOptions {
  dataSource = new DataSource({data: EXAMPLE_ITEMS});
  viewer = new Viewer({metadata: ExampleViewerMetadata});
  grouper = new Grouper({metadata: ExampleGrouperMetadata});
  sorter = new Sorter({metadata: ExampleSorterMetadata});

  exampleItemGroups = this.dataSource.data.pipe(this.sorter.sort(), this.grouper.group());
}
