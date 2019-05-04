import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {mergeMap} from 'rxjs/operators';
import {ActiveStore} from '../../../services/active-store';

export interface ItemDetailDialogData {
  itemId: string;
}

@Component({
  templateUrl: 'item-detail-dialog.html',
  styleUrls: ['item-detail-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailDialog {
  item$ =
    this.activeStore.state.pipe(mergeMap(repoState => repoState.itemsDao.get(`${this.data.itemId}`)));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ItemDetailDialogData,
    private activeStore: ActiveStore) {
  }
}
