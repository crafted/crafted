import {Action} from '@ngrx/store';
import {Item} from '../../../github/app-types/item';

export enum ItemActionTypes {
  UPDATE_ITEMS_FROM_GITHUB = '[Item] update items from github',
  LOAD_FROM_LOCAL_DB = '[Item] load from local db',
  ADD_LABEL = '[Item] add label',
  REMOVE_LABEL = '[Item] remove label',
  ADD_ASSIGNEE = '[Item] add assignee',
  REMOVE_ASSIGNEE = '[Item] remove assignee',
  REMOVE_ALL = '[Item] remove all',
}

export class UpdateItemsFromGithub implements Action {
  readonly type = ItemActionTypes.UPDATE_ITEMS_FROM_GITHUB;
  constructor(public payload: {items: Item[]}) {}
}

export class LoadItemsFromLocalDb implements Action {
  readonly type = ItemActionTypes.LOAD_FROM_LOCAL_DB;
  constructor(public payload: {items: Item[]}) {}
}

export class ItemAddLabelAction implements Action {
  readonly type = ItemActionTypes.ADD_LABEL;
  constructor(public payload: {id: string, label: string}) {}
}

export class ItemRemoveLabelAction implements Action {
  readonly type = ItemActionTypes.REMOVE_LABEL;
  constructor(public payload: {id: string, label: string}) {}
}

export class ItemAddAssigneeAction implements Action {
  readonly type = ItemActionTypes.ADD_ASSIGNEE;
  constructor(public payload: {id: string, assignee: string}) {}
}

export class ItemRemoveAssigneeAction implements Action {
  readonly type = ItemActionTypes.REMOVE_ASSIGNEE;
  constructor(public payload: {id: string, assignee: string}) {}
}

export class RemoveAllItems implements Action {
  readonly type = ItemActionTypes.REMOVE_ALL;
}

export type ItemAction = UpdateItemsFromGithub|ItemAddLabelAction|ItemRemoveLabelAction|LoadItemsFromLocalDb|
    ItemAddAssigneeAction|ItemRemoveAssigneeAction|RemoveAllItems;
