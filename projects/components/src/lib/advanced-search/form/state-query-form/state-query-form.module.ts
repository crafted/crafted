import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {StateQueryForm} from './state-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  declarations: [StateQueryForm],
  exports: [StateQueryForm]
})
export class StateQueryFormModule {
}
