import {Dashboard} from 'projects/github-dashboard/src/app/components';
import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';

export enum DashboardActionTypes {
  CREATE_DASHBOARD = '[Dashboard] create dashboard',
  UPDATE_DASHBOARD = '[Dashboard] update dashboard',
  UPSERT_DASHBOARDS = '[Dashboard] upsert dashboards',
  NAVIGATE_TO_DASHBOARD = '[Dashboard] navigate to dashboard',
  LOAD = '[Dashboard] load',
  LOAD_COMPLETE = '[Dashboard] load complete',
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

export class LoadDashboards implements Action {
  readonly type = DashboardActionTypes.LOAD;
  constructor(public payload: {repository: string}) {}
}

export class LoadDashboardsComplete implements Action {
  readonly type = DashboardActionTypes.LOAD_COMPLETE;
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

export type DashboardAction = CreateDashboard|UpdateDashboard|UpsertDashboards|
    LoadDashboards|RemoveDashboard|LoadDashboardsComplete;
