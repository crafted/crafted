import {Action} from '@ngrx/store';

export enum RepositoryActionTypes {
  LOAD_REPOSITORY = '[Repository] load',
}

export class LoadRepository implements Action {
  readonly type = RepositoryActionTypes.LOAD_REPOSITORY;
  constructor(public payload: {name: string}) {}
}

export type RepositoryAction = LoadRepository;
