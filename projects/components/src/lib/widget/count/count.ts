import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {DataSource, Filterer, FiltererState} from '@crafted/data';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {WIDGET_DATA, WidgetConfig, WidgetData} from '../../dashboard/dashboard';
import {SavedFiltererState} from '../../form/filter-state-option/filter-state-option';

import {CountEditor} from './count-editor';
import {CountOptions} from './count.module';


export type CountDataResourcesMap = Map<string, {
  id: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  dataSource: () => DataSource,
}>;

export interface CountWidgetDataConfig {
  dataResourcesMap: CountDataResourcesMap;
  savedFiltererStates: Observable<SavedFiltererState[]>;
}

@Component({
  selector: 'count',
  template: `{{count | async}}`,
  styles: [`
    :host {
      display: block;
      text-align: center;
      padding: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.fontSize.px]': 'data.options.fontSize',
  }
})
export class Count {
  count: Observable<number>;

  constructor(@Inject(WIDGET_DATA) public data: WidgetData<CountOptions, CountWidgetDataConfig>) {
    const dataSourceProvider =
      this.data.config.dataResourcesMap.get(this.data.options.dataSourceType);
    const filterer = dataSourceProvider.filterer(this.data.options.filtererState);
    const dataSource = dataSourceProvider.dataSource();
    this.count = dataSource.data.pipe(filterer.filter(), map(result => result.length));
  }
}

export function getCountWidgetConfig(
  dataResourcesMap: CountDataResourcesMap,
  savedFiltererStates: Observable<SavedFiltererState[]> =
    of([])): WidgetConfig<CountWidgetDataConfig> {
  return {
    id: 'count',
    label: 'Count',
    viewer: Count,
    editor: CountEditor,
    config: {dataResourcesMap, savedFiltererStates}
  };
}
