import {Action} from '@ngrx/store';
import {StoreId} from '../../repository/utility/app-indexed-db';

export enum LocalDbActionTypes {
  LOAD = '[LocalDb] load',
  ADD_ENTITIES = '[LocalDb] add entities',
  REMOVE_ENTITIES = '[LocalDb] remove entities',
  UPDATE_ENTITIES = '[LocalDb] update entities',
}

export class LoadLocalDb implements Action {
  readonly type = LocalDbActionTypes.LOAD;
}

export class AddLocalDbEntities implements Action {
  readonly type = LocalDbActionTypes.ADD_ENTITIES;
  constructor(public payload: {type: StoreId, entities: any[]}) {}
}

export class RemoveLocalDbEntities implements Action {
  readonly type = LocalDbActionTypes.REMOVE_ENTITIES;
  constructor(public payload: {type: StoreId, ids: any[]}) {}
}

export class UpdateLocalDbEntities implements Action {
  readonly type = LocalDbActionTypes.UPDATE_ENTITIES;
  constructor(public payload: {type: StoreId, entities: any[]}) {}
}

export type LocalDbActions =
    LoadLocalDb|AddLocalDbEntities|RemoveLocalDbEntities|UpdateLocalDbEntities;
