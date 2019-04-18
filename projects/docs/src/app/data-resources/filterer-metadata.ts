import {
  dateMatchesEquality,
  FiltererMetadata,
  numberMatchesEquality,
  textMatchesEquality
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
      type: 'text',
      matcher: (item, filter) => textMatchesEquality(item.name, filter.value, filter.equality),
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
      type: 'text',
      matcher: (item, filter) => textMatchesEquality(item.color, filter.value, filter.equality),
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
