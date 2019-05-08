import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {SavedFiltererState, WIDGET_DATA, WidgetData, WidgetEditor} from '@crafted/components';
import {DataSource, Filterer, Grouper} from '@crafted/data';
import {Observable} from 'rxjs';

import {PieChartOptions, PieChartWidgetDataConfig} from './pie-chart';


@Component({
  templateUrl: 'pie-chart-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartEditor implements WidgetEditor {
  dataOptions: {id: string, label: string}[] = [];

  grouper: Grouper<any, any>;
  filterer: Filterer<any, any>;
  dataSource: DataSource<any>;

  form = new FormGroup({
    dataType: new FormControl(null),
    grouperState: new FormControl(null),
    filteredGroups: new FormControl(null),
    filtererState: new FormControl(null),
  });

  savedFiltererStates: Observable<SavedFiltererState[]>;

  get options(): PieChartOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<PieChartOptions, PieChartWidgetDataConfig>) {
    // TODO: Filter based on data type
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
      d => this.dataOptions.push({id: d.type, label: d.label}));

    const dataType = this.dataOptions[0].id;
    this.form.get('dataType').setValue(dataType);
    const dataSourceProvider = data.config.dataResourcesMap.get(dataType);
    this.grouper = dataSourceProvider.grouper();
    this.filterer = dataSourceProvider.filterer();
    this.dataSource = dataSourceProvider.dataSource();

    const value = data.options;
    if (value) {
      if (value.dataType) {
        this.form.get('dataType').setValue(value.dataType);
      }
      if (value.grouperState) {
        this.form.get('grouperState').setValue(value.grouperState);
      }
      if (value.filteredGroups) {
        this.form.get('filteredGroups').setValue(value.filteredGroups);
      }
      if (value.filtererState) {
        this.form.get('filtererState').setValue(value.filtererState);
      }
    }
  }
}
