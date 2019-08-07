import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataSource, Filterer} from '@crafted/data';
import {Observable, Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';

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

  destroyed = new Subject();

  get options(): CountOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data: WidgetData<CountOptions, CountWidgetDataConfig>) {
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
        d => this.dataOptions.push({id: d.type, label: d.label}));

    const dataTypeForm = this.form.get('dataType');
    dataTypeForm.setValue(this.dataOptions[0].id);

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

    dataTypeForm.valueChanges.pipe(startWith(dataTypeForm.value), takeUntil(this.destroyed))
        .subscribe(dataType => this.handleDataTypeChange(dataType));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private handleDataTypeChange(dataType: string) {
    const dataSourceProvider = this.data.config.dataResourcesMap.get(dataType);
    this.filterer = dataSourceProvider.filterer(this.form.get('filtererState').value);
    this.dataSource = dataSourceProvider.dataSource();
    this.countPropertyIdOptions = this.dataSource.getDataLabelsWithType('number');

    const valueProperty = this.data.options && this.data.options.valueProperty;
    if (!valueProperty ||
        this.countPropertyIdOptions.map(o => o.id).indexOf(valueProperty) === -1) {
      this.form.get('valueProperty').setValue(this.countPropertyIdOptions[0].id);
    }
  }
}
