import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store';
import {selectItemById} from '../../../store/item/item.reducer';

export interface ItemDetailDialogData {
  itemId: string;
}

@Component({
  templateUrl: 'item-detail-dialog.html',
  styleUrls: ['item-detail-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailDialog {
  item$ = this.store.select(selectItemById(this.data.itemId));

  constructor(
    private store: Store<AppState>, @Inject(MAT_DIALOG_DATA) public data: ItemDetailDialogData) {}
}
