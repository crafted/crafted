import {Store} from '@ngrx/store';
import {AppState} from '../../store';

/** Whether the store contains repo data (labels, items, contributors) */
// TODO: Looks like it should be a pipable operator
export function isRepoStoreEmpty(store: Store<AppState>) {
  return store.select(
      state =>
          !state.contributors.ids.length && !state.labels.ids.length && !state.items.ids.length);
}
