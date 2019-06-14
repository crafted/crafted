import {Action} from '@ngrx/store';

export enum RepositoryActionTypes {
  SET_NAME = '[Repository] set name',
}

export class SetName implements Action {
  readonly type = RepositoryActionTypes.SET_NAME;
  constructor(public payload: {repository: string}) {}
}

export type NameAction = SetName;
