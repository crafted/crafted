import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import {RenderedView, Viewer} from '@crafted/data';
import {Observable} from 'rxjs';

@Component({
  selector: 'item-summary',
  templateUrl: 'item-summary.html',
  styleUrls: ['item-summary.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'(click)': 'select.emit(item)'}
})
export class ItemSummary<T, V> {
  views: Observable<RenderedView[]>;

  @Input() item: T;

  @Input() active: boolean;

  @Input() viewer: Viewer<T, any>;

  @Output() select = new EventEmitter<T>();

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['viewer'] || simpleChanges['item']) {
      this.views = this.viewer.getRenderedViews(this.item);
    }
  }
}
