import {SorterMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const EXAMPLE_SORTER_METADATA = new Map<string, SorterMetadata<ExampleItem>>([
  [
    'id', {
      label: 'ID',
      comparator: (a, b) => a.id < b.id ? -1 : 1,
    }
  ],

  [
    'name', {
      label: 'Name',
      comparator: (a, b) => a.name < b.name ? -1 : 1,
    }
  ],

  [
    'color', {
      label: 'Color',
      comparator: (a, b) => a.color < b.color ? -1 : 1,
    }
  ],

  [
    'age', {
      label: 'Age',
      comparator: (a, b) => a.age < b.age ? -1 : 1,
    }
  ],

  [
    'anniversary', {
      label: 'Anniversary',
      comparator: (a, b) => a.anniversary < b.anniversary ? -1 : 1,
    }
  ],
]);
