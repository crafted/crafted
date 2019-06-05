import {Action} from '@ngrx/store';

export namespace LocalDbActionTypes {
  export const LOAD = '[LocalDb] load';
  export const ADD_ENTITIES = '[LocalDb] add entities';
  export const REMOVE_ENTITIES = '[LocalDb] remove entities';
  export const UPDATE_ENTITIES = '[LocalDb] update entities';
}

export class LoadLocalDb implements Action {
  readonly type = LocalDbActionTypes.LOAD;
  constructor(public payload: {repository: string}) {}
}

export class AddLocalDbEntities implements Action {
  readonly type = LocalDbActionTypes.ADD_ENTITIES;
  constructor(public payload: {repository: string, type: string, entities: any[]}) {}
}

export class RemoveLocalDbEntities implements Action {
  readonly type = LocalDbActionTypes.REMOVE_ENTITIES;
  constructor(public payload: {repository: string, type: string, entities: any[]}) {}
}

export class UpdateLocalDbEntities implements Action {
  readonly type = LocalDbActionTypes.UPDATE_ENTITIES;
  constructor(public payload: {repository: string, type: string, entities: any[]}) {}
}

export type LocalDbActions =
    LoadLocalDb|AddLocalDbEntities|RemoveLocalDbEntities|UpdateLocalDbEntities;
