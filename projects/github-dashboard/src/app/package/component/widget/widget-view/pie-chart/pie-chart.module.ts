import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  ButtonToggleGroupOptionModule
} from '../../edit-widget/button-toggle-option/button-toggle-option.module';
import {
  FilterStateOptionModule
} from '../../edit-widget/filter-state-option/filter-state-option.module';
import {
  GroupStateOptionModule
} from '../../edit-widget/group-state-option/group-state-option.module';
import {InputOptionModule} from '../../edit-widget/input-option/input-option.module';
import {PieChart} from './pie-chart';
import {PieChartEdit} from './pie-chart-edit';

@NgModule({
  imports: [
    CommonModule,
    GroupStateOptionModule,
    InputOptionModule,
    ReactiveFormsModule,
    ButtonToggleGroupOptionModule,
    FilterStateOptionModule,
  ],
  declarations: [PieChart, PieChartEdit],
  exports: [PieChart, PieChartEdit],
  entryComponents: [PieChart, PieChartEdit]
})
export class PieChartModule {
}
