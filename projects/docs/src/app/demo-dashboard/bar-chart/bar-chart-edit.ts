import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {WIDGET_EDIT_DATA, WidgetEditData} from '@crafted/components';
import {DataSource, Filterer, Grouper} from '@crafted/data';
import {Subject} from 'rxjs';
import {startWith, take, takeUntil} from 'rxjs/operators';

import {BarChartDisplayTypeOptions, BarChartWidgetDataConfig} from './bar-chart';


@Component({
  template: `
  <ng-container [formGroup]="form">
    <form-field label="Data" *ngIf="dataOptions.length > 1">
      <mat-button-toggle-group formControlName="dataSourceType">
        <mat-button-toggle *ngFor="let option of dataOptions" [value]="option.id">
          {{option.label}}
        </mat-button-toggle>
      </mat-button-toggle-group>
    </form-field>

    <input-option formControlName="filteredGroups" label="Filter"
                  placeholder="(Optional) Filter by group title, e.g. 'Group A, Group B'">
    </input-option>

    <group-state-option formControlName="grouperState" label="Grouping"
                        [grouper]="grouper">
    </group-state-option>

    <filter-state-option formControlName="filtererState" [filterer]="filterer"
                        [dataSource]="dataSource">
    </filter-state-option>
  </ng-container>
  `,
  styleUrls: ['bar-chart-edit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartEdit {
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

  destroyed = new Subject();

  constructor(@Inject(WIDGET_EDIT_DATA) public data:
                  WidgetEditData<BarChartDisplayTypeOptions, BarChartWidgetDataConfig>) {
    this.data.config.dataResourcesMap.forEach(
        dataSource => this.dataOptions.push({id: dataSource.id, label: dataSource.label}));
    const initialDataSourceType = this.dataOptions[0].id;
    this.form.get('dataSourceType')!.setValue(initialDataSourceType);

    const dataSourceProvider = data.config.dataResourcesMap.get(initialDataSourceType)!;
    this.grouper = dataSourceProvider.grouper();
    this.filterer = dataSourceProvider.filterer();
    this.dataSource = dataSourceProvider.dataSource();

    data.options.pipe(take(1)).subscribe(value => {
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
    });

    this.form.valueChanges.pipe(startWith(this.form.value), takeUntil(this.destroyed))
        .subscribe(value => {
          data.options.next(value);
        });
  }
}
