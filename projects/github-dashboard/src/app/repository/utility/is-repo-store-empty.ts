import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {RepoState} from '../services/active-store';

/** Whether the store contains repo data (labels, items, contributors) */
export function isRepoStoreEmpty(repoState: RepoState) {
  const lists = [repoState.labelsDao.list, repoState.itemsDao.list, repoState.contributorsDao.list];
  return combineLatest(...lists).pipe(map(
      ([labels, items, contributors]) => !labels.length && !items.length && !contributors.length));
}
