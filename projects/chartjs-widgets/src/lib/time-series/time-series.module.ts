import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatButtonToggleModule, MatDatepickerModule} from '@angular/material';
import {FilterStateOptionModule, FormFieldModule} from '@crafted/components';
import {DatasetOptionModule} from './dataset-option/dataset-option.module';
import {TimeSeries} from './time-series';
import {TimeSeriesEditor} from './time-series-editor';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    FormFieldModule,
    FilterStateOptionModule,
    DatasetOptionModule,
  ],
  declarations: [TimeSeries, TimeSeriesEditor],
  exports: [TimeSeries, TimeSeriesEditor],
  entryComponents: [TimeSeries, TimeSeriesEditor]
})
export class TimeSeriesModule {
}
