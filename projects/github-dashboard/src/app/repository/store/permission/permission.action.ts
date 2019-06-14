import {Action} from '@ngrx/store';
import {RepositoryPermission} from '../../../github/github-types/permission';

export enum PermissionActionTypes {
  LOAD = '[Permission] load',
  SET = '[Permission] set',
}

export class LoadRepositoryPermission implements Action {
  readonly type = PermissionActionTypes.LOAD;
  constructor(public payload: {repository: string, user: string}) {}
}

export class SetRepositoryPermission implements Action {
  readonly type = PermissionActionTypes.SET;
  constructor(public payload: {permission: RepositoryPermission}) {}
}

export type PermissionAction = LoadRepositoryPermission|SetRepositoryPermission;

