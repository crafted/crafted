import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatSelectModule} from '@angular/material';
import {InputQueryForm} from './input-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule],
  declarations: [InputQueryForm],
  exports: [InputQueryForm]
})
export class InputQueryFormModule {
}
