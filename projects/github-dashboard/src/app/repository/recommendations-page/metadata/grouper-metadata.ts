import {getGroupByValue, GrouperMetadata} from '@crafted/data';
import {Recommendation} from '../../services/dao/config/recommendation';

export const RecommendationGrouperMetadata = new Map<string, GrouperMetadata<Recommendation>>([
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
