import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface ItemDetailDialogData {
  itemId: string;
}

@Component({
  templateUrl: 'item-detail-dialog.html',
  styleUrls: ['item-detail-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ItemDetailDialogData) {}
}
