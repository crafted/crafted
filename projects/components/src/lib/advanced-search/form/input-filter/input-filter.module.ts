import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatSelectModule} from '@angular/material';
import {InputFilter} from './input-filter';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule],
  declarations: [InputFilter],
  exports: [InputFilter]
})
export class InputFilterModule {
}
