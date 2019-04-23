import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  DataSource,
  Filterer,
  FiltererState,
  Sorter,
  SorterState,
  Viewer,
  ViewerState
} from '@crafted/data';
import {Observable, of} from 'rxjs';

import {SavedFiltererState} from '../widget-edit/widget-edit';
import {WIDGET_DATA, WidgetConfig, WidgetData} from '../widget-types';

import {ListEdit} from './list-edit';


export type ListDataResourcesMap = Map<string, {
  id: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  sorter: (initialValue?: SorterState) => Sorter,
  viewer: (initialValue?: ViewerState) => Viewer,
  dataSource: () => DataSource,
}>;

export interface ListWidgetDataConfig {
  dataResourcesMap: ListDataResourcesMap;
  onSelect: (item: any) => void;
  savedFiltererStates: Observable<SavedFiltererState[]>;
}

export function getListWidgetConfig(
    dataResourcesMap: ListDataResourcesMap, onSelect: (item: any) => void = () => null,
    savedFiltererStates: Observable<SavedFiltererState[]> =
        of([])): WidgetConfig<ListWidgetDataConfig> {
  return {
    id: 'list',
    label: 'List',
    component: List,
    editComponent: ListEdit,
    config: {dataResourcesMap, onSelect, savedFiltererStates}
  };
}

export interface ListDisplayTypeOptions {
  dataSourceType: string;
  listLength: number;
  sorterState: SorterState;
  viewerState: ViewerState;
  filtererState: FiltererState;
}

@Component({
  selector: 'list',
  templateUrl: 'list.html',
  styleUrls: ['list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  trackByIndex = (index: number) => index;

  listLength = this.data.options.listLength;

  items: Observable<any[]>;

  viewer: Viewer<any, any>;

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<ListDisplayTypeOptions, ListWidgetDataConfig>) {
    const dataSourceProvider =
        this.data.config.dataResourcesMap.get(this.data.options.dataSourceType)!;
    const sorter = dataSourceProvider.sorter(this.data.options.sorterState);
    const filterer = dataSourceProvider.filterer(this.data.options.filtererState);
    const dataSource = dataSourceProvider.dataSource();

    this.items = dataSource.data.pipe(filterer.filter(), sorter.sort());

    this.viewer = dataSourceProvider.viewer(this.data.options.viewerState);
  }
}
