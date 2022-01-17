import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {AdvancedSearchModule} from '../advanced-search/advanced-search.module';
import {DisplayOptionsModule} from '../display-options/display-options.module';
import {ItemSummaryModule} from '../item-summary/item-summary.module';
import {ItemsList} from './items-list';


@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatIconModule,
    ItemSummaryModule,
    DisplayOptionsModule,
    AdvancedSearchModule,
  ],
  declarations: [ItemsList],
  exports: [ItemsList],
})
export class ItemsListModule {
}
