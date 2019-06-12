import {Action} from '@ngrx/store';

export enum RepositoryActionTypes {
  UNLOAD = '[Repository] unload',
  LOAD = '[Repository] load',
}

export class UnloadRepository implements Action {
  readonly type = RepositoryActionTypes.UNLOAD;
  constructor(public payload: {name: string}) {}
}

export class LoadRepository implements Action {
  readonly type = RepositoryActionTypes.LOAD;
  constructor(public payload: {name: string}) {}
}

export type RepositoryAction = LoadRepository;
