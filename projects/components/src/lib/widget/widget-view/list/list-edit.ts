import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DataSource, Filterer, Sorter, Viewer} from '@crafted/data';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {ButtonToggleOption} from '../../edit-widget/button-toggle-option/button-toggle-option';
import {SavedFiltererState} from '../../edit-widget/edit-widget';
import {EDIT_WIDGET_DATA, EditWidgetData} from '../../widget';

import {ListDisplayTypeOptions, ListWidgetDataConfig} from './list';


@Component({
  templateUrl: 'list-edit.html',
  styleUrls: ['../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListEdit {
  dataOptions: ButtonToggleOption[] = [];

  viewer: Viewer<any, any>;
  sorter: Sorter<any, any, any>;
  filterer: Filterer<any, any>;
  dataSource: DataSource<any>;

  form = new FormGroup({
    dataSourceType: new FormControl(null),
    listLength: new FormControl(5),
    sorterState: new FormControl(null),
    viewerState: new FormControl(null),
    filtererState: new FormControl(null),
  });

  savedFiltererStates: Observable<SavedFiltererState[]>;

  constructor(@Inject(EDIT_WIDGET_DATA) public data:
                  EditWidgetData<ListDisplayTypeOptions<any>, ListWidgetDataConfig>) {
    // TODO: Filter based on datasource type
    this.savedFiltererStates = data.config.savedFiltererStates;
    this.data.config.dataResourcesMap.forEach(
        dataSource => this.dataOptions.push({id: dataSource.id, label: dataSource.label}));
    const initialDataSourceType = this.dataOptions[0].id;

    this.form.get('dataSourceType')!.setValue(initialDataSourceType);
    const dataSourceProvider = data.config.dataResourcesMap.get(initialDataSourceType)!;

    this.sorter = dataSourceProvider.sorter();
    this.viewer = dataSourceProvider.viewer();
    this.filterer = dataSourceProvider.filterer();
    this.dataSource = dataSourceProvider.dataSource();

    data.options.pipe(take(1)).subscribe(value => {
      if (value) {
        if (value.dataSourceType) {
          this.form.get('dataSourceType')!.setValue(value.dataSourceType);
        }
        if (value.listLength) {
          this.form.get('listLength')!.setValue(value.listLength);
        }
        if (value.sorterState) {
          this.form.get('sorterState')!.setValue(value.sorterState);
        }
        if (value.viewerState) {
          this.form.get('viewerState')!.setValue(value.sorterState);
        }
        if (value.filtererState) {
          this.form.get('filtererState')!.setValue(value.filtererState);
        }
      }
    });
    this.form.valueChanges.subscribe(value => {
      data.options.next(value);
    });
  }
}
