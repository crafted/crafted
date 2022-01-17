import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  DataSource,
  Filterer,
  FiltererState,
  Sorter,
  SorterState,
  Viewer,
  ViewerState
} from 'projects/github-dashboard/src/app/data';
import {Observable, of} from 'rxjs';

import {WIDGET_DATA, WidgetConfig, WidgetData} from '../../dashboard/dashboard';
import {SavedFiltererState} from '../../form/filter-state-option/filter-state-option';

import {ListEditor} from './list-editor';


export type ListDataResourcesMap = Map<string, {
  type: string,
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

export interface ListOptions {
  dataType: string;
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
  listLength = this.data.options.listLength;

  items: Observable<any[]>;

  viewer: Viewer<any, any>;

  constructor(@Inject(WIDGET_DATA) public data: WidgetData<ListOptions, ListWidgetDataConfig>) {
    const dataSourceProvider =
      this.data.config.dataResourcesMap.get(this.data.options.dataType);
    const sorter = dataSourceProvider.sorter(this.data.options.sorterState);
    const filterer = dataSourceProvider.filterer(this.data.options.filtererState);
    const dataSource = dataSourceProvider.dataSource();

    this.items = dataSource.data.pipe(filterer.filter(), sorter.sort());

    this.viewer = dataSourceProvider.viewer(this.data.options.viewerState);
  }

  trackByIndex = (index: number) => index;
}

export function getListWidgetConfig(
  dataResourcesMap: ListDataResourcesMap, onSelect: (item: any) => void = () => null,
  savedFiltererStates: Observable<SavedFiltererState[]> =
    of([])): WidgetConfig<ListWidgetDataConfig> {
  return {
    id: 'list',
    label: 'List',
    viewer: List,
    editor: ListEditor,
    config: {dataResourcesMap, onSelect, savedFiltererStates}
  };
}
