import {FiltererMetadata, InputQuery, stringContainsQuery} from '@crafted/data';
import {ExampleItem} from '../data';

export const DocsDataFiltererMetadata = new Map<string, FiltererMetadata>([
  [
    'name',
    {
      label: 'Name',
      queryType: 'input',
      matcher: (item: ExampleItem, q: InputQuery) => stringContainsQuery(item.name, q)
    },
  ],
]);
