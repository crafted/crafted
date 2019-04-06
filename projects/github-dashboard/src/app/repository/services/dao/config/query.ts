import {FiltererState} from 'projects/data/src/lib/filterer';
import {GrouperState} from 'projects/data/src/lib/grouper';
import {SorterState} from 'projects/data/src/lib/sorter';
import {ViewerState} from 'projects/data/src/lib/viewer';

export interface Query {
  id?: string;
  dbAdded?: string;
  dbModified?: string;
  name?: string;
  group?: string;
  dataSourceType?: string;
  filtererState?: FiltererState;
  grouperState?: GrouperState<any>;
  sorterState?: SorterState<any>;
  viewerState?: ViewerState<any>;
}
