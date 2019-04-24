import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {RenderedView, Viewer} from '@crafted/data';
import {Observable} from 'rxjs';

@Component({
  selector: 'item-summary',
  templateUrl: 'item-summary.html',
  styleUrls: ['item-summary.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSummary<T, V> {
  views: Observable<RenderedView[]>;

  @Input() item: T;

  @Input() viewer: Viewer<T, any>;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.viewer || simpleChanges.item) {
      this.views = this.viewer.getRenderedViews(this.item);
    }
  }
}
