import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {Query} from '../../model/query';
import {getRepoState} from '../repo-state.selector';
import {QueryAction, QueryActionTypes} from './query.action';
import {QueryState} from './query.state';

export const entityAdapter: EntityAdapter<Query> =
  createEntityAdapter<Query>();

const initialState: QueryState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
  loading: false,
};

// TODO: Add created and modified date
export function queryActionReducer(state: QueryState = initialState, action: QueryAction): QueryState {
  switch (action.type) {
    case QueryActionTypes.UPSERT_QUERIES:
      const queries = action.payload.queries.map(q => {
        return {...q, dbModified: new Date().toISOString()};
      });
      return entityAdapter.upsertMany(queries, state);

    case QueryActionTypes.LOAD:
      return {...state, loading: true};

    case QueryActionTypes.LOAD_COMPLETE:
      state = {...state, loading: false};
      return entityAdapter.addAll(action.payload.queries, state);

    case QueryActionTypes.REMOVE:
      return entityAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}

const {
  selectEntities,
  selectAll
} = entityAdapter.getSelectors();

const selectQueryState = createSelector(getRepoState, repoState => repoState.queries);

export const selectQueryEntities = createSelector(selectQueryState, selectEntities);
export const selectQueryList = createSelector(selectQueryState, selectAll);
export const selectQueryById = (id) => createSelector(selectQueryEntities, entities => entities[id]);
export const selectQueriesLoading =
  createSelector(selectQueryEntities, state => state.loading);
