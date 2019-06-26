import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {
  DataSource,
  Filterer,
  Grouper,
  RenderedView,
  Sorter,
  Viewer,
  ViewLabel
} from '@crafted/data';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';

@Component({
  selector: 'table-view',
  styleUrls: ['table-view.scss'],
  templateUrl: 'table-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableView {
  displayedColumns: Observable<string[]>;

  views: ViewLabel[];

  renderedHtml: Observable<Map<Item, Map<string, Observable<RenderedView>>>>;

  @Input() filterer: Filterer;

  @Input() viewer: Viewer;

  @Input() grouper: Grouper;

  @Input() sorter: Sorter;

  @Input() dataSource: DataSource;

  @Input() loading: boolean;

  itemCount: Observable<number>;

  data: Observable<Item[]>;

  ngOnInit() {
    this.data = this.dataSource.data.pipe(this.filterer.filter(), map(data => data.slice(0, 20)));

    this.displayedColumns = this.viewer.state.pipe(map(state => state.views));
    this.views = this.viewer.getViews();

    this.renderedHtml = this.data.pipe(map(items => {
      const renderedHtml = new Map<Item, Map<string, Observable<RenderedView>>>();
      items.forEach(item => {
        const itemRenderedViews = new Map<string, Observable<RenderedView>>();
        this.views.forEach(view => itemRenderedViews.set(view.id, this.viewer.getRenderedView(item, view.id)));
        renderedHtml.set(item, itemRenderedViews);
      });
      return renderedHtml;
    }), shareReplay(1));

    this.itemCount = this.data.pipe(map(d => d.length));
  }
}
