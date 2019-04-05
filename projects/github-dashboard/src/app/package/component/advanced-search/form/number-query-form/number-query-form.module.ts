import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {NumberQueryForm} from './number-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  declarations: [NumberQueryForm],
  exports: [NumberQueryForm]
})
export class NumberQueryFormModule {
}
