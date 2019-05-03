import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatChipsModule, MatIconModule} from '@angular/material';
import {LabelList} from './label-list';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule],
  declarations: [LabelList],
  exports: [LabelList],
})
export class LabelListModule {
}
