import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatTooltipModule
} from '@angular/material';
import {DateFilterModule} from '../filter/date-filter/date-filter.module';
import {NumberFilterModule} from '../filter/number-filter/number-filter.module';
import {StateFilterModule} from '../filter/state-filter/state-filter.module';
import {TextFilterModule} from '../filter/text-filter/text-filter.module';
import {AdvancedSearch} from './advanced-search';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    ReactiveFormsModule,
    DateFilterModule,
    TextFilterModule,
    NumberFilterModule,
    StateFilterModule,
  ],
  declarations: [AdvancedSearch],
  exports: [AdvancedSearch]
})
export class AdvancedSearchModule {
}
