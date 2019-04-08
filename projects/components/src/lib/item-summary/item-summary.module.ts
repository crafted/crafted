import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material';
import {ItemSummary} from './item-summary';
import {RenderedViewModule} from './rendered-view/rendered-view.module';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    RenderedViewModule,
  ],
  declarations: [ItemSummary],
  exports: [ItemSummary],
})
export class ItemSummaryModule {
}
