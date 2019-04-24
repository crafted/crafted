import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataSource, Filterer} from '@crafted/data';
import {Observable} from 'rxjs';

import {WIDGET_DATA, WidgetData, WidgetEditor} from '../../dashboard/dashboard';
import {SavedFiltererState} from '../../form';

import {CountWidgetDataConfig} from './count';
import {CountOptions} from './count.module';


@Component({
  templateUrl: 'count-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountEditor implements WidgetEditor {
  dataOptions: {id: string, label: string}[] = [];

  filterer: Filterer<any, any>;

  dataSource: DataSource<any>;

  form = new FormGroup({
    dataSourceType: new FormControl(null),
    fontSize: new FormControl(48),
    filtererState: new FormControl(null),
  });

  savedFiltererStates: Observable<SavedFiltererState[]>;

  get options(): CountOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data: WidgetData<CountOptions, CountWidgetDataConfig>) {
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
        (dataSource, type) => this.dataOptions.push({id: type, label: dataSource.label}));
    const initialDataSourceType = this.dataOptions[0].id;
    this.form.get('dataSourceType').setValue(initialDataSourceType);

    const dataResource = data.config.dataResourcesMap.get(initialDataSourceType);
    this.filterer = dataResource.filterer();
    this.dataSource = dataResource.dataSource();

    const value = data.options;
    if (value) {
      if (value.dataSourceType) {
        this.form.get('dataSourceType').setValue(value.dataSourceType);
      }
      if (value.fontSize) {
        this.form.get('fontSize').setValue(value.fontSize);
      }
      if (value.filtererState) {
        this.form.get('filtererState').setValue(value.filtererState);
      }
    }
  }
}
