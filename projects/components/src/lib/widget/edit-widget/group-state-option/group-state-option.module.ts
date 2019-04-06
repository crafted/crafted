import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {GroupStateOption} from './group-state-option';

@NgModule({
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  declarations: [GroupStateOption],
  exports: [GroupStateOption],
})
export class GroupStateOptionModule {
}
