import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material';
import {
  FilterStateOptionModule,
  FormFieldModule,
  GroupStateOptionModule
} from '@crafted/components';
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
