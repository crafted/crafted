import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {NumberFilter} from './number-filter';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  declarations: [NumberFilter],
  exports: [NumberFilter]
})
export class NumberFilterModule {
}
