import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import {TextFilter} from './text-filter';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule],
  declarations: [TextFilter],
  exports: [TextFilter]
})
export class TextFilterModule {
}
