import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppState} from '../../store';
import {RepoState} from '../services/active-store';

/** Whether the store contains repo data (labels, items, contributors) */
export function isRepoStoreEmpty(repoState: RepoState, store: Store<AppState>) {
  return combineLatest(...[repoState.labelsDao.list,
                           store.pipe(select(state => !state.items.ids.length)),
                           store.pipe(select(state => !state.contributors.ids.length)),
  ]).pipe(map(([labels, isItemsEmpty,
                isContributorsEmpty]) => !labels.length && isItemsEmpty && isContributorsEmpty));
}
