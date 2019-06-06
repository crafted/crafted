import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {AppState} from '../../../../store';

export interface ItemDetailDialogData {
  itemId: string;
}

@Component({
  templateUrl: 'item-detail-dialog.html',
  styleUrls: ['item-detail-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailDialog {
  item$ = this.store.select(state => state.items)
              .pipe(map(itemsState => itemsState.entities[this.data.itemId]));

  constructor(
      private store: Store<AppState>, @Inject(MAT_DIALOG_DATA) public data: ItemDetailDialogData) {}
}
