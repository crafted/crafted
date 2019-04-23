import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataSource, Filterer} from '@crafted/data';
import {Observable, Subject} from 'rxjs';
import {startWith, take, takeUntil} from 'rxjs/operators';

import {WIDGET_EDIT_DATA, WidgetEditData} from '../../widget';
import {SavedFiltererState} from '../../widget-edit/widget-edit';

import {CountWidgetDataConfig} from './count';
import {CountDisplayTypeOptions} from './count.module';


@Component({
  templateUrl: 'count-edit.html',
  styleUrls: ['count-edit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCount {
  dataOptions: {id: string, label: string}[] = [];

  filterer: Filterer<any, any>;

  dataSource: DataSource<any>;

  form = new FormGroup({
    dataSourceType: new FormControl(null),
    fontSize: new FormControl(48),
    filtererState: new FormControl(null),
  });

  savedFiltererStates: Observable<SavedFiltererState[]>;

  destroyed = new Subject();

  constructor(@Inject(WIDGET_EDIT_DATA) public data:
                  WidgetEditData<CountDisplayTypeOptions, CountWidgetDataConfig>) {
    // TODO: Filter based on datasource type
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
        (dataSource, type) => this.dataOptions.push({id: type, label: dataSource.label}));
    const initialDataSourceType = this.dataOptions[0].id;
    this.form.get('dataSourceType')!.setValue(initialDataSourceType);

    const dataResource = data.config.dataResourcesMap.get(initialDataSourceType)!;
    this.filterer = dataResource.filterer();
    this.dataSource = dataResource.dataSource();

    data.options.pipe(take(1)).subscribe(value => {
      if (value) {
        if (value.dataSourceType) {
          this.form.get('dataSourceType')!.setValue(value.dataSourceType);
        }
        if (value.fontSize) {
          this.form.get('fontSize')!.setValue(value.fontSize);
        }
        if (value.filtererState) {
          this.form.get('filtererState')!.setValue(value.filtererState);
        }
      }
    });

    this.form.valueChanges.pipe(startWith(this.form.value), takeUntil(this.destroyed))
        .subscribe(value => {
          if (value) {
            data.options.next(value);
          }
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
