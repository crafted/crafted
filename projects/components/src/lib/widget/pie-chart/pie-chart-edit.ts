import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataSource, Filterer, Grouper} from '@crafted/data';
import {Observable, Subject} from 'rxjs';

import {WIDGET_DATA, WidgetData, WidgetEditor} from '../../dashboard/dashboard';
import {SavedFiltererState} from '../../form/filter-state-option/filter-state-option';

import {PieChartOptions, PieChartWidgetDataConfig} from './pie-chart';


@Component({
  templateUrl: 'pie-chart-edit.html',
  styleUrls: ['pie-chart-edit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartEdit implements WidgetEditor {
  dataOptions: {id: string, label: string}[] = [];

  grouper: Grouper<any, any>;
  filterer: Filterer<any, any>;
  dataSource: DataSource<any>;

  form = new FormGroup({
    dataSourceType: new FormControl(null),
    grouperState: new FormControl(null),
    filteredGroups: new FormControl(null),
    filtererState: new FormControl(null),
  });

  savedFiltererStates: Observable<SavedFiltererState[]>;

  destroyed = new Subject();

  get options(): PieChartOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<PieChartOptions, PieChartWidgetDataConfig>) {
    // TODO: Filter based on datasource type
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
        dataSource => this.dataOptions.push({id: dataSource.id, label: dataSource.label}));
    const initialDataSourceType = this.dataOptions[0].id;
    this.form.get('dataSourceType')!.setValue(initialDataSourceType);

    // TODO: Add in a datasource type selector
    const dataSourceProvider = data.config.dataResourcesMap.get(initialDataSourceType)!;
    this.grouper = dataSourceProvider.grouper();
    this.filterer = dataSourceProvider.filterer();
    this.dataSource = dataSourceProvider.dataSource();

    const value = data.options;
    if (value) {
      if (value.dataSourceType) {
        this.form.get('dataSourceType')!.setValue(value.dataSourceType);
      }
      if (value.grouperState) {
        this.form.get('grouperState')!.setValue(value.grouperState);
      }
      if (value.filteredGroups) {
        this.form.get('filteredGroups')!.setValue(value.filteredGroups);
      }
      if (value.filtererState) {
        this.form.get('filtererState')!.setValue(value.filtererState);
      }
    }
  }
}
