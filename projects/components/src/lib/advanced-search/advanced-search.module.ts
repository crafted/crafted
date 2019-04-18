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
import {AdvancedSearch} from './advanced-search';
import {DateFilterModule} from './form/date-filter/date-filter.module';
import {InputFilterModule} from './form/input-filter/input-filter.module';
import {NumberFilterModule} from './form/number-filter/number-filter.module';
import {StateFilterModule} from './form/state-filter/state-filter.module';


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
    InputFilterModule,
    NumberFilterModule,
    StateFilterModule,
  ],
  declarations: [AdvancedSearch],
  exports: [AdvancedSearch]
})
export class AdvancedSearchModule {
}
