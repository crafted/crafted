import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {StateFilter} from './state-filter';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  declarations: [StateFilter],
  exports: [StateFilter]
})
export class StateFilterModule {
}
