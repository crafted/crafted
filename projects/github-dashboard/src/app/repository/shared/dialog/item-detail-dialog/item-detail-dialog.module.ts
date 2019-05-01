import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {ItemDetailModule} from '../../item-detail/item-detail.module';
import {ItemDetailDialog} from './item-detail-dialog';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ItemDetailModule,
  ],
  declarations: [ItemDetailDialog],
  exports: [ItemDetailDialog],
  entryComponents: [ItemDetailDialog]
})
export class ItemDetailDialogModule {
}
