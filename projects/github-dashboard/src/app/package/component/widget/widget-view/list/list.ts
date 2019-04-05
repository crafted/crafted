import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';

import {SavedFiltererState} from '../../edit-widget/edit-widget';
import {WIDGET_DATA, WidgetConfig, WidgetData} from '../../widget';

import {ListEdit} from './list-edit';
import {FiltererState, Filterer} from '../../../../data-source/filterer';
import {SorterState, Sorter} from '../../../../data-source/sorter';
import {ViewerState, Viewer} from '../../../../data-source/viewer';
import {DataSource} from '../../../../data-source/data-source';


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
    dataResourcesMap: ListDataResourcesMap, onSelect: (item: any) => void,
    savedFiltererStates: Observable<SavedFiltererState[]>): WidgetConfig<ListWidgetDataConfig> {
  return {
    id: 'list',
    label: 'List',
    component: List,
    editComponent: ListEdit,
    config: {dataResourcesMap, onSelect, savedFiltererStates}
  };
}

export interface ListDisplayTypeOptions<S, V> {
  dataSourceType: string;
  listLength: number;
  sorterState: SorterState<S>;
  viewerState: ViewerState<V>;
  filtererState: FiltererState;
}

@Component({
  selector: 'list',
  templateUrl: 'list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List<S, V> {
  trackByIndex = (index: number) => index;

  listLength = this.data.options.listLength;

  items: Observable<any[]>;

  viewer: Viewer<any, any, any>;

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<ListDisplayTypeOptions<S, V>, ListWidgetDataConfig>) {
    const dataSourceProvider =
        this.data.config.dataResourcesMap.get(this.data.options.dataSourceType)!;
    const sorter = dataSourceProvider.sorter(this.data.options.sorterState);
    const filterer = dataSourceProvider.filterer(this.data.options.filtererState);
    const dataSource = dataSourceProvider.dataSource();

    this.items = dataSource.data.pipe(filterer.filter(), sorter.sort());

    this.viewer = dataSourceProvider.viewer(this.data.options.viewerState);
  }
}
