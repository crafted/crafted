import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';
import {
  ButtonToggleGroupOptionModule
} from '../../../form/button-toggle-option/button-toggle-option.module';
import {DateOptionModule} from '../../../form/date-option/date-option.module';
import {
  FilterStateOptionModule
} from '../../../form/filter-state-option/filter-state-option.module';
import {InputOptionModule} from '../../../form/input-option/input-option.module';
import {DatasetOptionModule} from './dataset-option/dataset-option.module';
import {TimeSeries} from './time-series';
import {TimeSeriesEdit} from './time-series-edit';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    DateOptionModule,
    ButtonToggleGroupOptionModule,
    FilterStateOptionModule,
    InputOptionModule,
    DatasetOptionModule,
  ],
  declarations: [TimeSeries, TimeSeriesEdit],
  exports: [TimeSeries, TimeSeriesEdit],
  entryComponents: [TimeSeries, TimeSeriesEdit]
})
export class TimeSeriesModule {
}
