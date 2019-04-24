import {Component} from '@angular/core';
import {DataSource, Filterer, Viewer} from '@crafted/data';
import {EXAMPLE_ITEMS} from '../data';
import {EXAMPLE_FILTERER_METADATA} from '../data-resources/filterer-metadata';
import {EXAMPLE_VIEWER_METADATA} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-advanced-search',
  templateUrl: 'demo-advanced-search.html',
  styleUrls: ['demo-advanced-search.scss'],
})
export class DemoAdvancedSearch {
  dataSource = new DataSource({data: EXAMPLE_ITEMS});
  viewer = new Viewer({metadata: EXAMPLE_VIEWER_METADATA});
  filterer = new Filterer({metadata: EXAMPLE_FILTERER_METADATA});

  exampleItems = this.dataSource.data.pipe(this.filterer.filter());
}
