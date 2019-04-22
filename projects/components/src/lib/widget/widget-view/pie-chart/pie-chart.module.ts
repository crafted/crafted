import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  ButtonToggleGroupOptionModule
} from '../../../form/button-toggle-option/button-toggle-option.module';
import {
  FilterStateOptionModule
} from '../../../form/filter-state-option/filter-state-option.module';
import {GroupStateOptionModule} from '../../../form/group-state-option/group-state-option.module';
import {InputOptionModule} from '../../../form/input-option/input-option.module';
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
