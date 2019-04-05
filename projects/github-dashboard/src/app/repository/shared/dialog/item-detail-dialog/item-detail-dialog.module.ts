import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {ItemDetailModule} from '../../item-detail/item-detail.module';
import {ItemDetailDialog} from './item-detail-dialog';

@NgModule({
  imports: [
    MatIconModule,
    MatButtonModule,
    ItemDetailModule,
  ],
  declarations: [ItemDetailDialog],
  exports: [ItemDetailDialog],
  entryComponents: [ItemDetailDialog]
})
export class ItemDetailDialogModule {
}
