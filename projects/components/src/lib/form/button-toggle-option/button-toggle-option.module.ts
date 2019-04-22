import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule, MatIconModule} from '@angular/material';
import {FormFieldModule} from '../form-field/form-field.module';
import {ButtonToggleGroupOption} from './button-toggle-option';

@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatIconModule,
    FormFieldModule,
  ],
  declarations: [ButtonToggleGroupOption],
  exports: [ButtonToggleGroupOption],
})
export class ButtonToggleGroupOptionModule {
}
