import {Sorter, SorterMetadata, SorterState} from '@crafted/data';
import {Item} from '../app-types/item';

const ITEM_SORTER_METADATA = new Map<string, SorterMetadata<Item>>([
  [
    'created', {
      label: 'Date Opened',
      comparator: (a, b) => a.created < b.created ? -1 : 1,
    }
  ],

  [
    'updated', {
      label: 'Last Updated',
      comparator: (a, b) => a.updated < b.updated ? -1 : 1,
    }
  ],

  [
    'title', {
      label: 'Title',
      comparator: (a, b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1,
    }
  ],

  [
    'plusOneReactions', {
      label: '+1 Reactions',
      comparator: (a, b) => a.reactions['+1'] < b.reactions['+1'] ? -1 : 1,
    }
  ],
]);

export function getSorterProvider() {
  return (initialState?: SorterState) => {
    return new Sorter({
      metadata: ITEM_SORTER_METADATA,
      initialState: initialState || {sort: 'created', reverse: true},
    });
  };
}
