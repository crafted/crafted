import {Filterer, FiltererState} from '../data-source/filterer';
import {Grouper, GrouperState} from '../data-source/grouper';
import {DataSource} from '../data-source/data-source';
import {Sorter, SorterState} from '../data-source/sorter';
import {Viewer, ViewerState} from '../data-source/viewer';

export interface DataResources {
  id: string;
  label: string;
  viewer: (initialState?: ViewerState) => Viewer<any, any, any>;
  filterer: (initialState?: FiltererState) => Filterer;
  grouper: (initialState?: GrouperState) => Grouper;
  sorter: (initialState?: SorterState) => Sorter;
  dataSource: () => DataSource;
}
