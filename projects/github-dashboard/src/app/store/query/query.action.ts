import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {Query} from '../../repository/model/query';

export enum QueryActionTypes {
  CREATE_QUERY = '[Query] create query',
  UPDATE_QUERY = '[Query] update query',
  UPSERT_QUERIES = '[Query] upsert queries',
  NAVIGATE_TO_QUERY = '[Query] navigate to query',
  LOAD_FROM_LOCAL_DB = '[Query] load from local db',
  REMOVE = '[Query] remove',
  SYNC = '[Query] sync',
}

export enum NavigateToQueryType {
  NEW = 'new',
  BY_ID = 'by ID',
  BY_JSON = 'by JSON',
}

export type NavigateToQueryPayload = {
  type: NavigateToQueryType.NEW,
}|{
  type: NavigateToQueryType.BY_ID,
  id: string,
  replaceUrl?: boolean,
}|{
  type: NavigateToQueryType.BY_JSON,
  query: Partial<Query>,
};


export class CreateQuery implements Action {
  readonly type = QueryActionTypes.CREATE_QUERY;
  constructor(public payload: {query: Partial<Query>}) {}
}

export class UpdateQuery implements Action {
  readonly type = QueryActionTypes.UPDATE_QUERY;
  constructor(public payload: {update: Update<Query>}) {}
}

export class UpsertQueries implements Action {
  readonly type = QueryActionTypes.UPSERT_QUERIES;
  constructor(public payload: {queries: Query[]}) {}
}

export class NavigateToQuery implements Action {
  readonly type = QueryActionTypes.NAVIGATE_TO_QUERY;
  constructor(public payload: NavigateToQueryPayload) {}
}

export class LoadQueriesFromLocalDb implements Action {
  readonly type = QueryActionTypes.LOAD_FROM_LOCAL_DB;
  constructor(public payload: {queries: Query[]}) {}
}

export class RemoveQuery implements Action {
  readonly type = QueryActionTypes.REMOVE;
  constructor(public payload: {id: string}) {}
}

export class SyncQueries implements Action {
  readonly type = QueryActionTypes.SYNC;
  constructor(public payload: {update: Update<Query>[], remove: string[]}) {}
}

export type QueryAction = CreateQuery|UpdateQuery|UpsertQueries|LoadQueriesFromLocalDb|RemoveQuery;
