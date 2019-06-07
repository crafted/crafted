import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Query} from '../../repository/model/query';
import {QueryAction, QueryActionTypes} from './query.action';
import {QueryState} from './query.state';

export const entityAdapter: EntityAdapter<Query> =
  createEntityAdapter<Query>();

const initialState: QueryState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
};

// TODO: Add created and modified date
export function queryActionReducer(state: QueryState = initialState, action: QueryAction): QueryState {
  switch (action.type) {
    case QueryActionTypes.UPSERT_QUERIES:
      return entityAdapter.upsertMany(action.payload.queries, state);

    case QueryActionTypes.LOAD_FROM_LOCAL_DB:
      return entityAdapter.addAll(action.payload.queries, state);

    case QueryActionTypes.REMOVE:
      return entityAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}

export const selectAllQueries = entityAdapter.getSelectors().selectAll;
