import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ItemTitle} from './item-title';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [ItemTitle],
  exports: [ItemTitle],
})
export class ItemTitleModule {
}
