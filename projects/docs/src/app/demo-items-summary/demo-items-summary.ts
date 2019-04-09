import {Component} from '@angular/core';
import {Viewer} from '@crafted/data';

import {EXAMPLE_ITEMS, ExampleItem} from '../data';
import {DocsDataViewerMetadata as ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-items-summary',
  templateUrl: 'demo-items-summary.html',
  styleUrls: ['demo-items-summary.scss'],
})
export class DemoItemsSummary {
  exampleItems = EXAMPLE_ITEMS;

  viewer = new Viewer<ExampleItem>(ExampleViewerMetadata);
  viewOptions = this.viewer.getViews();
}
