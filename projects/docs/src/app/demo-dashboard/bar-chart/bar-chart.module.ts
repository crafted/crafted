import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material';
import {
  FilterStateOptionModule,
  FormFieldModule,
  GroupStateOptionModule
} from '@crafted/components';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BarChart} from './bar-chart';
import {BarChartEdit} from './bar-chart-edit';

@NgModule({
  imports: [
    NgxChartsModule,
    CommonModule,
    GroupStateOptionModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    FormFieldModule,
    FilterStateOptionModule,
  ],
  declarations: [BarChart, BarChartEdit],
  exports: [BarChart, BarChartEdit],
  entryComponents: [BarChart, BarChartEdit]
})
export class BarChartModule {
}
