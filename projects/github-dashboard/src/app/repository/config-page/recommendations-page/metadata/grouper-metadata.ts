import {getGroupByValue, GrouperMetadata} from '@crafted/data';
import {Recommendation} from '../../../model/recommendation';

export const RECOMMENDATION_GROUPER_METADATA = new Map<string, GrouperMetadata<Recommendation>>([
  [
    'all', {
      label: 'All',
      groupingFunction: items => {
        return [{id: 'all', title: 'All', items}];
      },
      titleTransform: () => '',
    }
  ],
  [
    'data', {
      label: 'Data',
      groupingFunction: items => getGroupByValue(items, 'data'),
    }
  ],
]);
