import {Component} from '@angular/core';
import {DataSource, Filterer, Viewer} from '@crafted/data';
import {of} from 'rxjs';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleFiltererMetadata} from '../data-resources/filterer-metadata';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-advanced-search',
  templateUrl: 'demo-advanced-search.html',
  styleUrls: ['demo-advanced-search.scss'],
})
export class DemoAdvancedSearch {
  dataSource = new DataSource(new Map(), of(EXAMPLE_ITEMS));
  viewer = new Viewer(ExampleViewerMetadata);
  filterer = new Filterer(ExampleFiltererMetadata);

  exampleItems = this.dataSource.data.pipe(this.filterer.filter());
}
