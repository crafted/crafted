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
    dataType: new FormControl(null),
    valueProperty: new FormControl(null),
    fontSize: new FormControl(48),
    filtererState: new FormControl(null),
  });

  savedFiltererStates: Observable<SavedFiltererState[]>;

  countPropertyIdOptions: {id: string, label: string}[] = [];

  get options(): CountOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data: WidgetData<CountOptions, CountWidgetDataConfig>) {
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
      d => this.dataOptions.push({id: d.type, label: d.label}));

    const dataType = this.dataOptions[0].id;
    this.form.get('dataType').setValue(dataType);
    const dataResource = data.config.dataResourcesMap.get(dataType);
    this.filterer = dataResource.filterer();
    this.dataSource = dataResource.dataSource();
    this.countPropertyIdOptions = this.dataSource.getDataLabelsWithType('number');
    this.form.get('valueProperty').setValue(this.countPropertyIdOptions[0].id);

    const value = data.options;
    if (value) {
      if (value.dataType) {
        this.form.get('dataType').setValue(value.dataType);
      }
      if (value.valueProperty) {
        this.form.get('valueProperty').setValue(value.valueProperty);
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
