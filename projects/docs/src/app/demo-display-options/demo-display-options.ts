import {Component} from '@angular/core';
import {DataSource, Grouper, Sorter, Viewer} from '@crafted/data';
import {EXAMPLE_ITEMS} from '../data';
import {EXAMPLE_GROUPER_METADATA} from '../data-resources/grouper-metadata';
import {EXAMPLE_SORTER_METADATA} from '../data-resources/sorter-metadata';
import {EXAMPLE_VIEWER_METADATA} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-display-options',
  templateUrl: 'demo-display-options.html',
  styleUrls: ['demo-display-options.scss'],
})
export class DemoDisplayOptions {
  dataSource = new DataSource({data: EXAMPLE_ITEMS});
  viewer = new Viewer({metadata: EXAMPLE_VIEWER_METADATA});
  grouper = new Grouper({metadata: EXAMPLE_GROUPER_METADATA});
  sorter = new Sorter({metadata: EXAMPLE_SORTER_METADATA});

  exampleItemGroups = this.dataSource.data.pipe(this.sorter.sort(), this.grouper.group());
}
