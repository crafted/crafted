import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {LabelList} from './label-list';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule],
  declarations: [LabelList],
  exports: [LabelList],
})
export class LabelListModule {
}
