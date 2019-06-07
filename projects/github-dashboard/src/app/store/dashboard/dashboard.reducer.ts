import {Dashboard} from '@crafted/components';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {DashboardAction, DashboardActionTypes} from './dashboard.action';
import {DashboardState} from './dashboard.state';

export const entityAdapter: EntityAdapter<Dashboard> =
  createEntityAdapter<Dashboard>();

const initialState: DashboardState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
};

// TODO: Add created and modified date
export function dashboardActionReducer(state: DashboardState = initialState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case DashboardActionTypes.UPSERT_DASHBOARDS:
      action.payload.dashboards.forEach(o => o.dbModified = new Date().toISOString());
      return entityAdapter.upsertMany(action.payload.dashboards, state);

    case DashboardActionTypes.LOAD_FROM_LOCAL_DB:
      return entityAdapter.addAll(action.payload.dashboards, state);

    case DashboardActionTypes.REMOVE:
      return entityAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}

export const selectAllDashboards = entityAdapter.getSelectors().selectAll;
