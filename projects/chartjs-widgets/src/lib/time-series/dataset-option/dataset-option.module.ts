import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatButtonToggleModule, MatIconModule} from '@angular/material';
import {FilterStateOptionModule, FormFieldModule} from '@crafted/components';
import {ActionOptionModule} from '../action-option/action-option.module';
import {DatasetOption} from './dataset-option';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    FilterStateOptionModule,
    ActionOptionModule,
    FormFieldModule,
  ],
  declarations: [DatasetOption],
  exports: [DatasetOption],
  entryComponents: [DatasetOption]
})
export class DatasetOptionModule {
}
