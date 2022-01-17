import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import {FilterStateOptionModule} from '../../form/filter-state-option/filter-state-option.module';
import {FormFieldModule} from '../../form/form-field/form-field.module';
import {SortStateOptionModule} from '../../form/sort-state-option/sort-state-option.module';
import {ViewStateOptionModule} from '../../form/view-state-option/view-state-option.module';
import {ItemSummaryModule} from '../../item-summary/item-summary.module';
import {List} from './list';
import {ListEditor} from './list-editor';

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
  declarations: [List, ListEditor],
  exports: [List, ListEditor],
  entryComponents: [List, ListEditor]
})
export class ListModule {
}
