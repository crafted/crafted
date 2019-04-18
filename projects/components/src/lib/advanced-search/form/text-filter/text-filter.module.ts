import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatSelectModule} from '@angular/material';
import {TextFilter} from './text-filter';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule],
  declarations: [TextFilter],
  exports: [TextFilter]
})
export class TextFilterModule {
}
