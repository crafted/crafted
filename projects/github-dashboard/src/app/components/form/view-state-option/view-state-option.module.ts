import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {EditableChipListModule} from '../../editable-chip-list/editable-chip-list.module';
import {FormFieldModule} from '../form-field/form-field.module';
import {ViewStateOption} from './view-state-option';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditableChipListModule,
    FormFieldModule,
  ],
  declarations: [ViewStateOption],
  exports: [ViewStateOption],
})
export class ViewStateOptionModule {
}
