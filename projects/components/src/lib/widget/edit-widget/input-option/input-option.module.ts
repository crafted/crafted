import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {FormFieldModule} from '../form-field/form-field.module';
import {InputOption} from './input-option';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormFieldModule,
  ],
  declarations: [InputOption],
  exports: [InputOption],
})
export class InputOptionModule {
}
