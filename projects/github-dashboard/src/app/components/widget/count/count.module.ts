import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import {FiltererState} from 'projects/github-dashboard/src/app/data';
import {FilterStateOptionModule} from '../../form/filter-state-option/filter-state-option.module';
import {FormFieldModule} from '../../form/form-field/form-field.module';
import {Count} from './count';
import {CountEditor} from './count-editor';

export interface CountOptions {
  dataType: string;
  valueProperty: string;
  fontSize: 'small'|'normal'|'large';
  filtererState: FiltererState;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldModule,
    MatButtonToggleModule,
    MatSelectModule,
    FilterStateOptionModule,
  ],
  declarations: [CountEditor, Count],
  exports: [CountEditor, Count],
  entryComponents: [CountEditor, Count]
})
export class CountModule {
}
