import {
  dateMatchesEquality,
  FiltererMetadata,
  numberMatchesEquality,
  stringContainsQuery
} from '@crafted/data';
import {ExampleItem} from '../data';

export const ExampleFiltererMetadata = new Map<string, FiltererMetadata<ExampleItem>>([
  [
    'id', {
      label: 'ID',
      type: 'number',
      matcher: (item, query) => numberMatchesEquality(item.id, query),
    }
  ],
  [
    'name', {
      label: 'Name',
      type: 'input',
      matcher: (item, query) => stringContainsQuery(item.name, query),
      autocomplete: items => items.map(i => i.name),
    }
  ],
  [
    'age', {
      label: 'Age',
      type: 'number',
      matcher: (item, query) => numberMatchesEquality(item.age, query),
    }
  ],
  [
    'color', {
      label: 'Color',
      type: 'input',
      matcher: (item, query) => stringContainsQuery(item.color, query),
      autocomplete: items => items.map(i => i.color),
    }
  ],
  [
    'anniversary', {
      label: 'Anniversary',
      type: 'date',
      matcher: (item, query) => dateMatchesEquality(item.anniversary, query),
    }
  ],
]);
