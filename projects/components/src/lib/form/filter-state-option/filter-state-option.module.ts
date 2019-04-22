import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {AdvancedSearchModule} from '../../advanced-search/advanced-search.module';
import {FormFieldModule} from '../form-field/form-field.module';
import {FilterStateOption} from './filter-state-option';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
    AdvancedSearchModule,
    FormFieldModule,
  ],
  declarations: [FilterStateOption],
  exports: [FilterStateOption],
})
export class FilterStateOptionModule {
}
