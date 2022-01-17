import {Dashboard} from 'projects/github-dashboard/src/app/components';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {getRepoState} from '../repo-state.selector';
import {DashboardAction, DashboardActionTypes} from './dashboard.action';
import {DashboardState} from './dashboard.state';

export const entityAdapter: EntityAdapter<Dashboard> = createEntityAdapter<Dashboard>();

const initialState: DashboardState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
  loading: false,
};

// TODO: Add created and modified date
export function dashboardActionReducer(
    state: DashboardState = initialState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case DashboardActionTypes.UPSERT_DASHBOARDS:
      const dashboards = action.payload.dashboards.map(d => {
        return {...d, dbModified: new Date().toISOString()};
      });
      return entityAdapter.upsertMany(dashboards, state);

    case DashboardActionTypes.LOAD:
      return {...state, loading: true};

    case DashboardActionTypes.LOAD_COMPLETE:
      state = {...state, loading: false};
      return entityAdapter.addAll(action.payload.dashboards, state);

    case DashboardActionTypes.REMOVE:
      return entityAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}

const {
  selectEntities,
  selectAll,
} = entityAdapter.getSelectors();

const selectDashboardState = createSelector(getRepoState, repoState => repoState.dashboards);

export const selectDashboardEntities = createSelector(selectDashboardState, selectEntities);
export const selectDashboards = createSelector(selectDashboardState, selectAll);
export const selectDashboardById = (id) =>
    createSelector(selectDashboardEntities, entities => entities[id]);
export const selectDashboardsLoading =
  createSelector(selectDashboardState, state => state.loading);

