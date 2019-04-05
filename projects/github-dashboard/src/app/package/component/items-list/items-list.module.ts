import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatDividerModule, MatProgressSpinnerModule} from '@angular/material';
import {AdvancedSearchModule} from '../advanced-search/advanced-search.module';
import {DisplayOptionsHeaderModule} from '../display-options-header/display-options-header.module';
import {ItemSummaryModule} from './item-summary/item-summary.module';
import {ItemsList} from './items-list';


@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ItemSummaryModule,
    DisplayOptionsHeaderModule,
    AdvancedSearchModule,
  ],
  declarations: [ItemsList],
  exports: [ItemsList],
})
export class ItemsListModule {
}
