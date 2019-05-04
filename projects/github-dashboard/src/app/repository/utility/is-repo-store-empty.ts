import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {RepoState} from '../services/active-store';

/** Whether the store contains repo data (labels, items, contributors) */
export function isRepoStoreEmpty(repoState: RepoState) {
  return combineLatest(repoState.labelsDao.list, repoState.itemsDao.list, repoState.contributorsDao.list)
      .pipe(map(results => !results[0].length && !results[1].length && !results[2].length));
}
