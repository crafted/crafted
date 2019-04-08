import {Component} from '@angular/core';
import {Viewer} from '@crafted/data';
import {DATA} from './data';
import {DocsDataViewerMetadata} from './data-resources/view-metadata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  items = DATA;

  viewer = new Viewer(DocsDataViewerMetadata);

  ngOnInit() {
    this.viewer.setState({views: this.viewer.getViews().map(v => v.id)});
  }
}
