import {Sorter, SorterMetadata, SorterState} from '@crafted/data';
import {of} from 'rxjs';
import {Item} from '../app-types/item';

export function getSorterProvider() {
  return (initialState?: SorterState) => {
    return new Sorter(
        GithubItemSortingMetadata, of(null), initialState || {sort: 'created', reverse: true});
  };
}

const GithubItemSortingMetadata = new Map<string, SorterMetadata<Item>>([
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
