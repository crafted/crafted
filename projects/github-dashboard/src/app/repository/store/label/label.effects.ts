import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/repository-database';
import {selectIsAuthenticated} from '../../../store/auth/auth.reducer';
import {Updater} from '../../services/updater';
import {AppState} from '../index';
import {RemoveAllItems} from '../item/item.action';
import {selectRepositoryName} from '../repository/repository.reducer';
import {LabelActionTypes, UpdateLabelsFromGithub} from './label.action';

@Injectable()
export class LabelEffects {
  /**
   * After the items are loaded from the local database, request updates from GitHub periodically
   * if the user is authenticated.
   */
  @Effect({dispatch: false})
  update = this.actions.pipe(
    ofType(LabelActionTypes.LOAD_FROM_LOCAL_DB),
    switchMap(() => this.store.select(selectIsAuthenticated).pipe(take(1))),
    tap(isAuthenticated => {
      if (isAuthenticated) {
        this.updater.update('labels');
      }
    }));

  @Effect({dispatch: false})
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateLabelsFromGithub>(LabelActionTypes.UPDATE_FROM_GITHUB),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'labels', action.payload.labels);
      }));

  @Effect({dispatch: false})
  persistRemoveAllToLocalDb = this.actions.pipe(
      ofType<RemoveAllItems>(LabelActionTypes.REMOVE_ALL),
      switchMap(() => this.store.select(selectRepositoryName).pipe(take(1))),
      tap(repository => this.repositoryDatabase.removeAll(repository, 'labels')));

  constructor(
      private actions: Actions, private store: Store<AppState>,
      private updater: Updater,
      private repositoryDatabase: RepositoryDatabase) {}
}
