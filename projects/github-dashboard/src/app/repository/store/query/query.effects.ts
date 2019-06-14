import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';

import {RepositoryDatabase} from '../../../service/repository-database';
import {createId} from '../../../utility/create-id';
import {AppState} from '../index';
import {ItemActionTypes} from '../item/item.action';
import {selectRepositoryName} from '../name/name.reducer';

import {
  CreateQuery,
  LoadQueries,
  LoadQueriesComplete,
  NavigateToQuery,
  NavigateToQueryType,
  QueryActionTypes,
  RemoveQuery,
  SyncQueries,
  UpdateQuery,
  UpsertQueries
} from './query.action';
import {selectQueryEntities} from './query.reducer';

@Injectable()
export class QueryEffects {
  @Effect()
  load = this.actions.pipe(
    ofType<LoadQueries>(ItemActionTypes.LOAD), switchMap(action => {
      return this.repositoryDatabase.getValues(action.payload.repository)
        .queries.pipe(
          take(1),
          map(queries => new LoadQueriesComplete({queries})));
    }));

  @Effect()
  createNewQuery = this.actions.pipe(
      ofType<CreateQuery>(QueryActionTypes.CREATE_QUERY), switchMap(action => {
        const newQuery = {
          id: createId(),
          dbAdded: new Date().toISOString(),
          ...action.payload.query
        };

        const navigationToQueryAction = new NavigateToQuery(
            {type: NavigateToQueryType.BY_ID, id: newQuery.id, replaceUrl: true});
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
              navigationExtras = {replaceUrl: true, queryParamsHandling: 'merge'};
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
      withLatestFrom(this.store.select(selectQueryEntities)), map(([action, queries]) => {
        const query = {
          ...queries[action.payload.update.id],
          ...action.payload.update.changes,
        };

        return new UpsertQueries({queries: [query]});
      }));

  @Effect({dispatch: false})
  persistUpsert = this.actions.pipe(
      ofType<UpsertQueries>(QueryActionTypes.UPSERT_QUERIES),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'queries', action.payload.queries);
      }));

  @Effect({dispatch: false})
  persistRemove = this.actions.pipe(
      ofType<RemoveQuery>(QueryActionTypes.REMOVE),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.remove(repository, 'queries', [action.payload.id]);
      }));

  @Effect()
  sync = this.actions.pipe(
      ofType<SyncQueries>(QueryActionTypes.SYNC),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        if (action.payload.remove.length) {
          this.repositoryDatabase.remove(repository, 'queries', action.payload.remove);
        }

        if (action.payload.update.length) {
          this.repositoryDatabase.update(repository, 'queries', action.payload.update);
        }
      }));

  constructor(
      private actions: Actions, private store: Store<AppState>, private router: Router,
      private repositoryDatabase: RepositoryDatabase) {}
}
