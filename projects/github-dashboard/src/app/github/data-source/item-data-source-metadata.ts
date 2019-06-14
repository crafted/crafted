import {DataSource, DataSourceMetadata} from '@crafted/data';
import {Observable} from 'rxjs';
import {Item} from '../app-types/item';

const ITEM_DATA_SOURCE_METADATA = new Map<string, DataSourceMetadata<Item>>([
  [
    'opened', {
      label: 'Date Opened',
      type: 'date',
      accessor: (item: Item) => item.created,
    }
  ],
  [
    'closed', {
      label: 'Date Closed',
      type: 'date',
      accessor: (item: Item) => item.closed,
    }
  ],
  [
    'count', {
      label: 'Count',
      type: 'number',
      accessor: () => 1,
    }
  ],
  [
    'plusOneReactions', {
      label: '+1 Reactions',
      type: 'number',
      accessor: (item: Item) => item.reactions['+1'],
    }
  ],
]);

export function getDataSourceProvider(data: Observable<Item[]>) {
  return () => {
    return new DataSource<Item>({data, metadata: ITEM_DATA_SOURCE_METADATA});
  };
}
