import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  DataSource,
  Filterer,
  Grouper,
  RenderedView,
  Sorter,
  Viewer,
  ViewLabel
} from '@crafted/data';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';

interface TablePage {
  index: number;
  size: number;
}

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

  page: BehaviorSubject<TablePage> = new BehaviorSubject({size: 20, index: 0});

  renderedData: Observable<Item[]>;

  ngOnInit() {
    // TODO: Cannot be in ngOnInit since the inputs may change
    const curatedData = this.dataSource.data.pipe(this.filterer.filter(), this.sorter.sort());
    this.renderedData =
        combineLatest(curatedData, this.page)
            .pipe(
                map(([data, page]) =>
                        data.slice(page.index * page.size, page.index * page.size + page.size)));
    this.itemCount = curatedData.pipe(map(d => d.length));

    this.views = this.viewer.getViews();
    this.displayedColumns = this.viewer.state.pipe(map(state => {
      return this.views.map(v => v.id).filter(v => state.views.indexOf(v) !== -1);
    }));

    this.renderedHtml = this.renderedData.pipe(
        map(items => {
          const renderedHtml = new Map<Item, Map<string, Observable<RenderedView>>>();
          items.forEach(item => {
            const itemRenderedViews = new Map<string, Observable<RenderedView>>();
            this.views.forEach(
                view => itemRenderedViews.set(view.id, this.viewer.getRenderedView(item, view.id)));
            renderedHtml.set(item, itemRenderedViews);
          });
          return renderedHtml;
        }),
        shareReplay(1));
  }

  setPage(event: PageEvent) {
    this.page.next({index: event.pageIndex, size: event.pageSize});
  }
}
