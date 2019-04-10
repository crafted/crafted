import {
  dateMatchesEquality,
  DateQuery,
  FiltererMetadata,
  InputQuery,
  numberMatchesEquality,
  NumberQuery,
  stringContainsQuery
} from '@crafted/data';
import {ExampleItem} from '../data';

export const DocsDataFiltererMetadata = new Map<string, FiltererMetadata>([
  [
    'id', {
      label: 'ID',
      queryType: 'number',
      matcher: (item: ExampleItem, q: NumberQuery) => numberMatchesEquality(item.id, q),
    }
  ],
  [
    'name', {
      label: 'Name',
      queryType: 'input',
      matcher: (item: ExampleItem, q: InputQuery) => stringContainsQuery(item.name, q),
      autocomplete: (items: ExampleItem[]) => items.map(i => i.name)
    }
  ],
  [
    'age', {
      label: 'Age',
      queryType: 'number',
      matcher: (item: ExampleItem, q: NumberQuery) => numberMatchesEquality(item.age, q)
    }
  ],
  [
    'color', {
      label: 'Color',
      queryType: 'input',
      matcher: (item: ExampleItem, q: InputQuery) => stringContainsQuery(item.color, q),
      autocomplete: (items: ExampleItem[]) => items.map(i => i.color),
    }
  ],
  [
    'anniversary', {
      label: 'Anniversary',
      queryType: 'date',
      matcher: (item: ExampleItem, q: DateQuery) => dateMatchesEquality(item.anniversary, q),
    }
  ],
]);
