import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import {StoreId} from '../../repository/utility/app-indexed-db';
import {createId} from '../../utility/create-id';
import {AppState} from '../index';
import {RemoveLocalDbEntities, UpdateLocalDbEntities} from '../local-db/local-db.actions';

import {
  CreateQuery,
  NavigateToQuery,
  QueryActionTypes,
  RemoveQuery,
  SyncQueries,
  UpdateQuery,
  UpsertQueries
} from './query.action';

@Injectable()
export class QueryEffects {
  @Effect()
  createNewQuery = this.actions.pipe(
      ofType<CreateQuery>(QueryActionTypes.CREATE_QUERY), switchMap(action => {
        const newQuery = {
          id: createId(),
          ...action.payload.query
        };

        return [new UpsertQueries({queries: [newQuery]}), new NavigateToQuery({id: newQuery.id})];
      }));

  @Effect({dispatch: false})
  navigateToQuery = this.actions.pipe(
      ofType<NavigateToQuery>(QueryActionTypes.NAVIGATE_TO_QUERY), withLatestFrom(this.store),
      tap(([action, state]) => this.router.navigate(
              [`${state.repository.name}/query/${action.payload.id}`],
              {replaceUrl: true, queryParamsHandling: 'merge'})));

  @Effect()
  update = this.actions.pipe(
      ofType<UpdateQuery>(QueryActionTypes.UPDATE_QUERY),
      withLatestFrom(this.store.select(state => state.queries.entities)),
      map(([action, queries]) => {
        const query = {
          ...queries[action.payload.update.id],
          ...action.payload.update.changes,
        };

        return new UpsertQueries({queries: [query]});
      }));

  @Effect()
  persistUpsert = this.actions.pipe(
      ofType<UpsertQueries>(QueryActionTypes.UPSERT_QUERIES), map(action => {
        const updatePayload = {entities: action.payload.queries, type: 'queries' as StoreId};
        return new UpdateLocalDbEntities(updatePayload);
      }));

  @Effect()
  persistRemove = this.actions.pipe(
      ofType<RemoveQuery>(QueryActionTypes.REMOVE),
      map(action =>
              new RemoveLocalDbEntities({ids: [action.payload.id], type: 'queries' as StoreId})));

  @Effect()
  sync = this.actions.pipe(ofType<SyncQueries>(QueryActionTypes.SYNC), switchMap(action => {
                             const removeAction = new RemoveLocalDbEntities(
                                 {ids: [action.payload.remove], type: 'queries' as StoreId});
                             const updateAction = new UpdateLocalDbEntities(
                                 {entities: [action.payload.update], type: 'queries' as StoreId});
                             return [removeAction, updateAction];
                           }));

  constructor(private actions: Actions, private store: Store<AppState>, private router: Router) {}
}
