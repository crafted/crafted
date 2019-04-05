import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {SortStateOption} from './sort-state-option';

@NgModule({
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  declarations: [SortStateOption],
  exports: [SortStateOption],
})
export class SortStateOptionModule {
}
