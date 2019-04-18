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
      matcher: (item, filter) => numberMatchesEquality(item.id, filter.value, filter.equality),
    }
  ],
  [
    'name', {
      label: 'Name',
      type: 'input',
      matcher: (item, filter) => stringContainsQuery(item.name, filter.input, filter.equality),
      autocomplete: items => items.map(i => i.name),
    }
  ],
  [
    'age', {
      label: 'Age',
      type: 'number',
      matcher: (item, filter) => numberMatchesEquality(item.age, filter.value, filter.equality),
    }
  ],
  [
    'color', {
      label: 'Color',
      type: 'input',
      matcher: (item, filter) => stringContainsQuery(item.color, filter.input, filter.equality),
      autocomplete: items => items.map(i => i.color),
    }
  ],
  [
    'anniversary', {
      label: 'Anniversary',
      type: 'date',
      matcher: (item, filter) =>
          dateMatchesEquality(item.anniversary, filter.date, filter.equality),
    }
  ],
]);
