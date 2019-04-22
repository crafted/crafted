import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatNativeDateModule, MatSelectModule} from '@angular/material';
import {DateFilter} from './date-filter';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule
  ],
  declarations: [DateFilter],
  exports: [DateFilter]
})
export class DateFilterModule {
}
