import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ButtonToggleOption,
  EDIT_WIDGET_DATA,
  EditWidgetData,
  PieChartDisplayTypeOptions,
  PieChartWidgetDataConfig
} from '@crafted/components';
import {DataSource, Filterer, Grouper} from '@crafted/data';
import {Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';

@Component({
  template: `
  <ng-container [formGroup]="form">
    <button-toggle-group-option formControlName="dataSourceType" label="Data"
                                [options]="dataOptions">
    </button-toggle-group-option>

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBarChart {
  dataOptions: ButtonToggleOption[] = [];

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

  constructor(@Inject(EDIT_WIDGET_DATA) public data:
                  EditWidgetData<PieChartDisplayTypeOptions<any>, PieChartWidgetDataConfig>) {
    this.data.config.dataResourcesMap.forEach(
        dataSource => this.dataOptions.push({id: dataSource.id, label: dataSource.label}));
    const initialDataSourceType = this.dataOptions[0].id;
    this.form.get('dataSourceType')!.setValue(initialDataSourceType);

    const dataSourceProvider = data.config.dataResourcesMap.get(initialDataSourceType)!;
    this.grouper = dataSourceProvider.grouper();
    this.filterer = dataSourceProvider.filterer();
    this.dataSource = dataSourceProvider.dataSource();

    this.form.valueChanges.pipe(startWith(this.form.value), takeUntil(this.destroyed))
        .subscribe(value => {
          data.options.next(value);
        });
  }
}
