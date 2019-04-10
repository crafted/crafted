import {getGroupByValue, GrouperMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const ExampleGrouperMetadata = new Map<string, GrouperMetadata<ExampleItem>>([
  [
    'all', {
      label: 'All',
      groupingFunction: items => {
        return [{id: 'all', title: 'All', items}];
      },
    }
  ],
  [
    'color', {
      label: 'Color',
      groupingFunction: items => getGroupByValue(items, 'color'),
    }
  ],
]);
