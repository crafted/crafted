import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material';
import {FiltererState} from '@crafted/data';
import {
  FilterStateOptionModule
} from '../../../form/filter-state-option/filter-state-option.module';
import {FormFieldModule} from '../../../form/form-field/form-field.module';
import {Count} from './count';
import {EditCount} from './count-edit';

export interface CountDisplayTypeOptions {
  dataSourceType: string;
  fontSize: 'small'|'normal'|'large';
  filtererState: FiltererState;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldModule,
    MatButtonToggleModule,
    FilterStateOptionModule,
  ],
  declarations: [EditCount, Count],
  exports: [EditCount, Count],
  entryComponents: [EditCount, Count]
})
export class CountModule {
}
