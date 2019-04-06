import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule, MatRippleModule} from '@angular/material';
import {ItemSummary} from './item-summary';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatRippleModule,
  ],
  declarations: [ItemSummary],
  exports: [ItemSummary],
})
export class ItemSummaryModule {
}
