import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule, MatDividerModule, MatRippleModule} from '@angular/material';
import {
  FilterStateOptionModule
} from '../../../form/filter-state-option/filter-state-option.module';
import {FormFieldModule} from '../../../form/form-field/form-field.module';
import {SortStateOptionModule} from '../../../form/sort-state-option/sort-state-option.module';
import {ViewStateOptionModule} from '../../../form/view-state-option/view-state-option.module';
import {ItemSummaryModule} from '../../../item-summary/item-summary.module';
import {List} from './list';
import {ListEdit} from './list-edit';

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatRippleModule,
    ReactiveFormsModule,
    ItemSummaryModule,
    SortStateOptionModule,
    ViewStateOptionModule,
    FormFieldModule,
    MatButtonToggleModule,
    FilterStateOptionModule,
  ],
  declarations: [List, ListEdit],
  exports: [List, ListEdit],
  entryComponents: [List, ListEdit]
})
export class ListModule {
}
