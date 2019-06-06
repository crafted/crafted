import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppState} from '../../store';
import {RepoState} from '../services/active-store';

/** Whether the store contains repo data (labels, items, contributors) */
export function isRepoStoreEmpty(repoState: RepoState, store: Store<AppState>) {
  const lists = [repoState.labelsDao.list, store.pipe(select(state => state.items)), repoState.contributorsDao.list];
  return combineLatest(...lists).pipe(map(
      ([labels, items, contributors]) => !labels.length && !items.length && !contributors.length));
}
