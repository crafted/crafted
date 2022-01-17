import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {FilterStateOptionModule, FormFieldModule} from 'projects/github-dashboard/src/app/components';
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
