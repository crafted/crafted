import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/local-database';
import {AppState} from '../index';
import {RemoveAllItems} from '../item/item.action';
import {selectRepositoryName} from '../repository/repository.reducer';
import {LabelActionTypes, UpdateLabelsFromGithub} from './label.action';
import {selectLabelIds} from './label.reducer';

@Injectable()
export class LabelEffects {
  @Effect({dispatch: false})
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateLabelsFromGithub>(LabelActionTypes.UPDATE_FROM_GITHUB),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'labels', action.payload.labels);
      }));

  @Effect({dispatch: false})
  persistRemoveAllToLocalDb = this.actions.pipe(
      ofType<RemoveAllItems>(LabelActionTypes.REMOVE_ALL),
      switchMap(() => combineLatest([
                        this.store.select(selectLabelIds), this.store.select(selectRepositoryName)
                      ]).pipe(take(1))),
      tap(([ids, repository]) => {
        this.repositoryDatabase.remove(repository, 'labels', ids);
      }));


  constructor(
      private actions: Actions, private store: Store<AppState>,
      private repositoryDatabase: RepositoryDatabase) {}
}
