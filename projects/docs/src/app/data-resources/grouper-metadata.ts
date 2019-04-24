import {getGroupByValue, GrouperMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const EXAMPLE_GROUPER_METADATA = new Map<string, GrouperMetadata<ExampleItem>>([
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
