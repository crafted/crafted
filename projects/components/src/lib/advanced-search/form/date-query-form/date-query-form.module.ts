import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatSelectModule, MatNativeDateModule} from '@angular/material';
import {DateQueryForm} from './date-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  declarations: [DateQueryForm],
  exports: [DateQueryForm]
})
export class DateQueryFormModule {
}
