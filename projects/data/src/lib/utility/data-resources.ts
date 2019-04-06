import {DataSource} from '../data-source';
import {Filterer, FiltererState} from '../filterer';
import {Grouper, GrouperState} from '../grouper';
import {Sorter, SorterState} from '../sorter';
import {Viewer, ViewerState} from '../viewer';

export interface DataResources {
  id: string;
  label: string;
  viewer: (initialState?: ViewerState) => Viewer<any, any, any>;
  filterer: (initialState?: FiltererState) => Filterer;
  grouper: (initialState?: GrouperState) => Grouper;
  sorter: (initialState?: SorterState) => Sorter;
  dataSource: () => DataSource;
}
