import {Component} from '@angular/core';
import {Viewer} from '@crafted/data';
import {EXAMPLE_ITEMS} from '../data';
import {ExampleViewerMetadata} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-items-summary',
  templateUrl: 'demo-items-summary.html',
  styleUrls: ['demo-items-summary.scss'],
})
export class DemoItemsSummary {
  exampleItems = EXAMPLE_ITEMS;

  viewer = new Viewer({metadata: ExampleViewerMetadata});
  viewOptions = this.viewer.getViews();
}
