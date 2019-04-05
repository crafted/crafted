import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatChipsModule} from '@angular/material';
import {LabelList} from './label-list';

@NgModule({
  imports: [CommonModule, MatChipsModule],
  declarations: [LabelList],
  exports: [LabelList],
})
export class LabelListModule {
}
