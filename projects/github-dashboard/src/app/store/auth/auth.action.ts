import {Action} from '@ngrx/store';

export enum AuthActionTypes {
  UNLOAD = '[Repository] unload',
  LOAD = '[Repository] load',
}

export class UnloadRepository implements Action {
  readonly type = AuthActionTypes.UNLOAD;
}

export class LoadRepository implements Action {
  readonly type = AuthActionTypes.LOAD;
  constructor(public payload: {name: string}) {}
}

export type AuthAction = LoadRepository;
