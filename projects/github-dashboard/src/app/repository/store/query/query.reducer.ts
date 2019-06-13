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
};

// TODO: Add created and modified date
export function queryActionReducer(state: QueryState = initialState, action: QueryAction): QueryState {
  switch (action.type) {
    case QueryActionTypes.UPSERT_QUERIES:
      action.payload.queries.forEach(o => o.dbModified = new Date().toISOString());
      return entityAdapter.upsertMany(action.payload.queries, state);

    case QueryActionTypes.LOAD_COMPLETE:
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
