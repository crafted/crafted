import {Component} from '@angular/core';
import {DataSource, Grouper, Sorter, Viewer} from '@crafted/data';
import {Filterer} from 'projects/data/src/public-api';
import {EXAMPLE_ITEMS} from '../data';
import {EXAMPLE_FILTERER_METADATA} from '../data-resources/filterer-metadata';
import {EXAMPLE_GROUPER_METADATA} from '../data-resources/grouper-metadata';
import {EXAMPLE_SORTER_METADATA} from '../data-resources/sorter-metadata';
import {EXAMPLE_VIEWER_METADATA} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-items-list',
  templateUrl: 'demo-items-list.html',
  styleUrls: ['demo-items-list.scss'],
})
export class DemoItemsList {
  dataSource = new DataSource({data: EXAMPLE_ITEMS});
  viewer = new Viewer({metadata: EXAMPLE_VIEWER_METADATA});
  grouper = new Grouper({metadata: EXAMPLE_GROUPER_METADATA});
  filterer = new Filterer({metadata: EXAMPLE_FILTERER_METADATA});
  sorter = new Sorter({metadata: EXAMPLE_SORTER_METADATA});
}
