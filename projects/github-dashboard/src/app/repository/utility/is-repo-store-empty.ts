import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {DataStore} from '../services/dao/data-dao';

/** Whether the store contains repo data (labels, items, contributors) */
export function isRepoStoreEmpty(store: DataStore) {
  return combineLatest(store.labels.list, store.items.list, store.contributors.list)
      .pipe(map(results => !results[0].length && !results[1].length && !results[2].length));
}
