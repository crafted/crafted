import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  ButtonToggleGroupOptionModule,
  FilterStateOptionModule,
  GroupStateOptionModule,
  InputOptionModule
} from '@crafted/components';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BarChart} from './bar-chart';
import {BarChartEdit} from './bar-chart-edit';

@NgModule({
  imports: [
    NgxChartsModule,
    CommonModule,
    GroupStateOptionModule,
    InputOptionModule,
    ReactiveFormsModule,
    ButtonToggleGroupOptionModule,
    FilterStateOptionModule,
  ],
  declarations: [BarChart, BarChartEdit],
  exports: [BarChart, BarChartEdit],
  entryComponents: [BarChart, BarChartEdit]
})
export class BarChartModule {
}
