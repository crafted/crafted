import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map, switchMap, take, withLatestFrom} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/local-database';
import {AppState} from '../index';
import {RemoveAllItems} from '../item/item.action';
import {selectRepositoryName} from '../repository/repository.reducer';
import {ContributorActionTypes, UpdateContributorsFromGithub} from './contributor.action';
import {selectContributorIds} from './contributor.reducer';

@Injectable()
export class ContributorEffects {
  @Effect({dispatch: false})
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateContributorsFromGithub>(ContributorActionTypes.UPDATE_FROM_GITHUB),
      withLatestFrom(this.store.select(selectRepositoryName)),
      map(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'contributors', action.payload.contributors);
      }));

  @Effect({dispatch: false})
  persistRemoveAllToLocalDb = this.actions.pipe(
    ofType<RemoveAllItems>(ContributorActionTypes.REMOVE_ALL),
    switchMap(() => combineLatest([
      this.store.select(selectContributorIds), this.store.select(selectRepositoryName)
    ]).pipe(take(1))),
    map(([ids, repository]) => {
      this.repositoryDatabase.remove(repository, 'contributors', ids);
    }));

  constructor(private actions: Actions, private store: Store<AppState>, private repositoryDatabase: RepositoryDatabase) {}
}
