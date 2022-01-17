import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {SavedFiltererState, WIDGET_DATA, WidgetData, WidgetEditor} from 'projects/github-dashboard/src/app/components';
import {DataSource, Filterer, Grouper} from 'projects/github-dashboard/src/app/data';
import {Observable, Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';

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

  destroyed = new Subject();

  get options(): PieChartOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<PieChartOptions, PieChartWidgetDataConfig>) {
    // TODO: Filter based on data type
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
      d => this.dataOptions.push({id: d.type, label: d.label}));

    const dataTypeForm = this.form.get('dataType');
    this.form.get('dataType').setValue(this.dataOptions[0].id);

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

    dataTypeForm.valueChanges.pipe(startWith(dataTypeForm.value), takeUntil(this.destroyed))
      .subscribe(dataType => this.handleDataTypeChange(dataType));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private handleDataTypeChange(dataType: string) {
    const dataSourceProvider = this.data.config.dataResourcesMap.get(dataType);
    this.grouper = dataSourceProvider.grouper(this.form.get('grouperState').value);
    this.filterer = dataSourceProvider.filterer(this.form.get('filtererState').value);
    this.dataSource = dataSourceProvider.dataSource();
  }
}
