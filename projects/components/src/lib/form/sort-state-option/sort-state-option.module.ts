import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {FormFieldModule} from '../form-field/form-field.module';
import {SortStateOption} from './sort-state-option';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormFieldModule,
  ],
  declarations: [SortStateOption],
  exports: [SortStateOption],
})
export class SortStateOptionModule {
}
