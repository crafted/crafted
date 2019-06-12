import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, take, withLatestFrom} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/repository-database';
import {AppState} from '../index';
import {RemoveAllItems} from '../item/item.action';
import {selectRepositoryName} from '../repository/repository.reducer';
import {ContributorActionTypes, UpdateContributorsFromGithub} from './contributor.action';

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
    switchMap(() => this.store.select(selectRepositoryName).pipe(take(1))),
    map(repository => this.repositoryDatabase.removeAll(repository, 'contributors')));

  constructor(private actions: Actions, private store: Store<AppState>, private repositoryDatabase: RepositoryDatabase) {}
}
