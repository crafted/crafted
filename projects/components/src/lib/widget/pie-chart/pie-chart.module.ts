import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material';
import {FilterStateOptionModule} from '../../form/filter-state-option/filter-state-option.module';
import {FormFieldModule} from '../../form/form-field/form-field.module';
import {GroupStateOptionModule} from '../../form/group-state-option/group-state-option.module';
import {PieChart} from './pie-chart';
import {PieChartEditor} from './pie-chart-editor';

@NgModule({
  imports: [
    CommonModule,
    GroupStateOptionModule,
    ReactiveFormsModule,
    FormFieldModule,
    MatButtonToggleModule,
    FilterStateOptionModule,
  ],
  declarations: [PieChart, PieChartEditor],
  exports: [PieChart, PieChartEditor],
  entryComponents: [PieChart, PieChartEditor]
})
export class PieChartModule {
}
