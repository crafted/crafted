import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import {AppIndexedDb} from '../../utility/app-indexed-db';
import {LoadContributorsFromLocalDb} from '../contributor/contributor.action';
import {LoadDashboardsFromLocalDb} from '../dashboard/dashboard.action';
import {AppState} from '../index';
import {LoadItemsFromLocalDb} from '../item/item.action';
import {LoadLabelsFromLocalDb} from '../label/label.action';
import {LoadQueriesFromLocalDb} from '../query/query.action';
import {LoadRecommendationsFromLocalDb} from '../recommendation/recommendation.action';
import {selectRepositoryName} from '../repository/repository.reducer';

import {LocalDbActionTypes, RemoveLocalDbEntities, UpdateLocalDbEntities} from './local-db.actions';

@Injectable()
export class LocalDbEffects {
  private openLocalDatabases = new Map<string, AppIndexedDb>();

  @Effect()
  load = this.actions.pipe(
    ofType(LocalDbActionTypes.LOAD),
    mergeMap(() => this.store.select(selectRepositoryName)),
    switchMap(repository => {
      const localDb = this.getLocalDatabase(repository);

      const initialValues = [
        localDb.initialValues.items,
        localDb.initialValues.labels,
        localDb.initialValues.contributors,
        localDb.initialValues.dashboards,
        localDb.initialValues.queries,
        localDb.initialValues.recommendations,
      ];

      return combineLatest(...initialValues);
    }),
    switchMap(result => {
      return [
        new LoadItemsFromLocalDb({items: result[0]}),
        new LoadLabelsFromLocalDb({labels: result[1]}),
        new LoadContributorsFromLocalDb({contributors: result[2]}),
        new LoadDashboardsFromLocalDb({dashboards: result[3]}),
        new LoadQueriesFromLocalDb({queries: result[4]}),
        new LoadRecommendationsFromLocalDb({recommendations: result[5]}),
      ];
    }));

  @Effect({dispatch: false})
  updateEntities = this.actions.pipe(
    ofType<UpdateLocalDbEntities>(LocalDbActionTypes.UPDATE_ENTITIES),
    withLatestFrom(this.store.select(selectRepositoryName)),
    tap(([action, repository]) => {
      const localDb = this.getLocalDatabase(repository);
      localDb.updateValues(action.payload.entities, action.payload.type);
    }));


  @Effect({dispatch: false})
  removeEntities = this.actions.pipe(
    ofType<RemoveLocalDbEntities>(LocalDbActionTypes.REMOVE_ENTITIES),
    withLatestFrom(this.store.select(selectRepositoryName)),
    tap(([action, repository]) => {
      const localDb = this.getLocalDatabase(repository);
      localDb.removeValues(action.payload.ids, action.payload.type);
    }));

  constructor(private actions: Actions, private store: Store<AppState>) {}

  private getLocalDatabase(repository: string) {
    if (!this.openLocalDatabases.has(repository)) {
      this.openLocalDatabases.set(repository, new AppIndexedDb(repository));
    }

    return this.openLocalDatabases.get(repository);
  }
}