import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/repository-database';
import {selectIsAuthenticated} from '../../../store/auth/auth.reducer';
import {Updater} from '../../services/updater';
import {AppState} from '../index';
import {selectRepositoryName} from '../repository/repository.reducer';
import {ContributorActionTypes, UpdateContributorsFromGithub} from './contributor.action';

@Injectable()
export class ContributorEffects {
  /**
   * After the items are loaded from the local database, request updates from GitHub periodically
   * if the user is authenticated.
   */
  @Effect({dispatch: false})
  update = this.actions.pipe(
      ofType(ContributorActionTypes.LOAD_FROM_LOCAL_DB),
      switchMap(() => this.store.select(selectIsAuthenticated).pipe(take(1))),
      tap(isAuthenticated => {
        if (isAuthenticated) {
          this.updater.update('contributors');
        }
      }));

  @Effect({dispatch: false})
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateContributorsFromGithub>(ContributorActionTypes.UPDATE_FROM_GITHUB),
      withLatestFrom(this.store.select(selectRepositoryName)), map(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'contributors', action.payload.contributors);
      }));

  @Effect({dispatch: false})
  persistRemoveAllToLocalDb = this.actions.pipe(
      ofType(ContributorActionTypes.REMOVE_ALL),
      switchMap(() => this.store.select(selectRepositoryName).pipe(take(1))),
      map(repository => this.repositoryDatabase.removeAll(repository, 'contributors')));

  constructor(
      private actions: Actions, private updater: Updater, private store: Store<AppState>,
      private repositoryDatabase: RepositoryDatabase) {}
}
