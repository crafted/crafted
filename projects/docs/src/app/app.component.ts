import {Component} from '@angular/core';
import {Viewer} from '@crafted/data';

import {EXAMPLE_ITEMS, ExampleItem} from './data';
import {DocsDataViewerMetadata as ExampleViewerMetadata} from './data-resources/viewer-metadata';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  exampleItems = EXAMPLE_ITEMS;

  viewer = new Viewer<ExampleItem>(ExampleViewerMetadata);
  viewOptions = this.viewer.getViews();

  ngOnInit() {
    this.viewer.setState({views: this.viewer.getViews().map(v => v.id)});
  }
}
