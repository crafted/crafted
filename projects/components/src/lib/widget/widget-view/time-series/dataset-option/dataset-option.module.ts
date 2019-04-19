import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {
  ButtonToggleGroupOptionModule
} from '../../../edit-widget/button-toggle-option/button-toggle-option.module';
import {FormFieldModule} from '../../../edit-widget/form-field/form-field.module';
import {
  FilterStateOptionModule
} from '../../../edit-widget/group-state-option/filter-state-option.module';
import {InputOptionModule} from '../../../edit-widget/input-option/input-option.module';
import {ActionOptionModule} from '../action-option/action-option.module';
import {DatasetOption} from './dataset-option';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    InputOptionModule,
    ButtonToggleGroupOptionModule,
    FilterStateOptionModule,
    ActionOptionModule,
    FormFieldModule,
  ],
  declarations: [DatasetOption],
  exports: [DatasetOption],
  entryComponents: [DatasetOption]
})
export class DatasetOptionModule {
}
