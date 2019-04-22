import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FiltererState} from '@crafted/data';
import {
  ButtonToggleGroupOptionModule
} from '../../../form/button-toggle-option/button-toggle-option.module';
import {
  FilterStateOptionModule
} from '../../../form/filter-state-option/filter-state-option.module';
import {InputOptionModule} from '../../../form/input-option/input-option.module';
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
    InputOptionModule,
    ButtonToggleGroupOptionModule,
    FilterStateOptionModule,
  ],
  declarations: [EditCount, Count],
  exports: [EditCount, Count],
  entryComponents: [EditCount, Count]
})
export class CountModule {
}
