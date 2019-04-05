import {FiltererState} from 'projects/github-dashboard/src/app/package/data-source/filterer';
import {GrouperState} from 'projects/github-dashboard/src/app/package/data-source/grouper';
import {SorterState} from 'projects/github-dashboard/src/app/package/data-source/sorter';
import {ViewerState} from 'projects/github-dashboard/src/app/package/data-source/viewer';

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
