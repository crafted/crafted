import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
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
