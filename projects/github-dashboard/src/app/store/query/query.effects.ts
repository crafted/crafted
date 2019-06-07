import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
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
  NavigateToQueryType,
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
          dbAdded: new Date().toISOString(),
          ...action.payload.query
        };

        const navigationToQueryAction = new NavigateToQuery({
          type: NavigateToQueryType.BY_ID,
          id: newQuery.id,
          replaceUrl: true
        });
        return [new UpsertQueries({queries: [newQuery]}), navigationToQueryAction];
      }));

  @Effect({dispatch: false})
  navigateToQuery = this.actions.pipe(
      ofType<NavigateToQuery>(QueryActionTypes.NAVIGATE_TO_QUERY), withLatestFrom(this.store),
      tap(([action, state]) => {
        let id: string;
        let navigationExtras: NavigationExtras;

        switch (action.payload.type) {
          case NavigateToQueryType.NEW:
            id = 'new';
            break;

          case NavigateToQueryType.BY_ID:
            id = action.payload.id;
            if (action.payload.replaceUrl) {
              navigationExtras = { replaceUrl: true, queryParamsHandling: 'merge' };
            }
            break;

          case NavigateToQueryType.BY_JSON:
            id = 'new';
            navigationExtras = {queryParams: {query: JSON.stringify(action.payload.query)}};
            break;
        }

        this.router.navigate([`${state.repository.name}/query/${id}`], navigationExtras);
      }));

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
