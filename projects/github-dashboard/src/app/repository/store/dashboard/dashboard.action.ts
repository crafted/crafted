import {Dashboard} from '@crafted/components';
import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';

export enum DashboardActionTypes {
  CREATE_DASHBOARD = '[Dashboard] create dashboard',
  UPDATE_DASHBOARD = '[Dashboard] update dashboard',
  UPSERT_DASHBOARDS = '[Dashboard] upsert dashboards',
  NAVIGATE_TO_DASHBOARD = '[Dashboard] navigate to dashboard',
  LOAD_FROM_LOCAL_DB = '[Dashboard] load from local db',
  REMOVE = '[Dashboard] remove',
  SYNC = '[Dashboard] sync',
}

export class CreateDashboard implements Action {
  readonly type = DashboardActionTypes.CREATE_DASHBOARD;
}

export class UpdateDashboard implements Action {
  readonly type = DashboardActionTypes.UPDATE_DASHBOARD;
  constructor(public payload: {update: Update<Dashboard>}) {}
}

export class UpsertDashboards implements Action {
  readonly type = DashboardActionTypes.UPSERT_DASHBOARDS;
  constructor(public payload: {dashboards: Dashboard[]}) {}
}

export class NavigateToDashboard implements Action {
  readonly type = DashboardActionTypes.NAVIGATE_TO_DASHBOARD;
  constructor(public payload: {id: string}) {}
}

export class LoadDashboardsFromLocalDb implements Action {
  readonly type = DashboardActionTypes.LOAD_FROM_LOCAL_DB;
  constructor(public payload: {dashboards: Dashboard[]}) {}
}

export class RemoveDashboard implements Action {
  readonly type = DashboardActionTypes.REMOVE;
  constructor(public payload: {id: string}) {}
}

export class SyncDashboards implements Action {
  readonly type = DashboardActionTypes.SYNC;
  constructor(public payload: {update: Update<Dashboard>[], remove: string[]}) {}
}

export type DashboardAction = CreateDashboard|
    UpdateDashboard|UpsertDashboards|LoadDashboardsFromLocalDb|RemoveDashboard;
