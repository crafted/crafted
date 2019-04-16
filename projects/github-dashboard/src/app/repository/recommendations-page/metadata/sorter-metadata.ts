import {SorterMetadata} from '@crafted/data';
import {Recommendation} from '../../services/dao/config/recommendation';

export const RecommendationSorterMetadata = new Map<string, SorterMetadata<Recommendation>>([
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
      comparator: (a, b) => a.data < b.data ? -1 : 1,
    }
  ],

  [
    'resultsCount', {
      label: 'Results Count',
      comparator: (a, b) => a.data < b.data ? -1 : 1,
    }
  ],
]);
