import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'collection-page-empty-state',
  templateUrl: 'collection-page-empty-state.html',
  styleUrls: ['collection-page-empty-state.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionPageEmptyState {
  @Input() message: string;

  @Input() icon: string;

  @Input() actionText: string;

  @Output() action = new EventEmitter();
}

