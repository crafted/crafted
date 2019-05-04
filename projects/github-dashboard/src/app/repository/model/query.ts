import {FiltererState, GrouperState, SorterState, ViewerState} from '@crafted/data';

export interface Query {
  id?: string;
  dbAdded?: string;
  dbModified?: string;
  name?: string;
  group?: string;
  dataType?: string;
  filtererState?: FiltererState;
  grouperState?: GrouperState;
  sorterState?: SorterState;
  viewerState?: ViewerState;
}
