import {DataSourceMetadata} from '@crafted/data';
import {ExampleItem} from '../data';

export const EXAMPLE_DATA_SOURCE_METADATA = new Map<string, DataSourceMetadata<ExampleItem>>([
  [
    'anniversary', {
      label: 'Anniversary',
      type: 'date',
      accessor: item => item.anniversary,
    }
  ],
]);
