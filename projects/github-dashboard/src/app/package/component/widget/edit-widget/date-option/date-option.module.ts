import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {DateOption} from './date-option';

@NgModule({
  imports: [CommonModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatNativeDateModule,],
  declarations: [DateOption],
  exports: [DateOption],
})
export class DateOptionModule {
}
