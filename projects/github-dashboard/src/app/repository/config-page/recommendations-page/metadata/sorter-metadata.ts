import {SorterMetadata} from 'projects/github-dashboard/src/app/data';
import {Recommendation} from '../../../model/recommendation';

export const RECOMMENDATION_SORTER_METADATA = new Map<string, SorterMetadata<Recommendation>>([
  [
    'date-created', {
      label: 'Date Created',
      comparator: (a, b) => a.dbAdded < b.dbAdded ? -1 : 1,
    }
  ],

  [
    'date-modified', {
      label: 'Date Modified',
      comparator: (a, b) => a.dbModified < b.dbModified ? -1 : 1,
    }
  ],

  [
    'action', {
      label: 'Action',
      comparator: (a, b) => a.actionType < b.actionType ? -1 : 1,
    }
  ],

  [
    'message', {
      label: 'Message',
      comparator: (a, b) => a.message < b.message ? -1 : 1,
    }
  ],

  [
    'type', {
      label: 'Type',
      comparator: (a, b) => a.type < b.type ? -1 : 1,
    }
  ],

  [
    'data', {
      label: 'Data',
    comparator: (a, b) => a.dataType < b.dataType ? -1 : 1,
    }
  ],

  [
    'resultsCount', {
      label: 'Results Count',
    comparator: (a, b) => a.dataType < b.dataType ? -1 : 1,
    }
  ],
]);
