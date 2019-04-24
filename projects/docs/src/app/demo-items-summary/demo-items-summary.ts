import {Component} from '@angular/core';
import {Viewer} from '@crafted/data';
import {EXAMPLE_ITEMS} from '../data';
import {EXAMPLE_VIEWER_METADATA} from '../data-resources/viewer-metadata';


@Component({
  selector: 'demo-items-summary',
  templateUrl: 'demo-items-summary.html',
  styleUrls: ['demo-items-summary.scss'],
})
export class DemoItemsSummary {
  exampleItems = EXAMPLE_ITEMS;

  viewer = new Viewer({metadata: EXAMPLE_VIEWER_METADATA});
  viewOptions = this.viewer.getViews();
}
