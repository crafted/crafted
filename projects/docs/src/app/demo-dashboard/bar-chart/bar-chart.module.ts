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
import {EditBarChart} from './edit-bar-chart';

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
  declarations: [BarChart, EditBarChart],
  exports: [BarChart, EditBarChart],
  entryComponents: [BarChart, EditBarChart]
})
export class BarChartModule {
}
