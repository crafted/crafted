import {Action} from '@ngrx/store';
import {Item} from '../../github/app-types/item';

export namespace ItemActionTypes {
  export const LOAD_LOCAL_ITEMS = '[Item] load local items';
  export const ADD_ONE_ITEM = '[Item] add one item';
  export const ADD_MANY_ITEMS = '[Item] add many items';
  export const ADD_ALL_ITEMS = '[Item] add all items';
  export const ADD_LABEL = '[Item] add label';
  export const REMOVE_LABEL = '[Item] remove label';
}

export class AddOneItem implements Action {
  readonly type = ItemActionTypes.ADD_ONE_ITEM;
  constructor(public payload: {item: Item}) {}
}

export class AddManyItems implements Action {
  readonly type = ItemActionTypes.ADD_MANY_ITEMS;
  constructor(public payload: {items: Item[]}) {}
}

export class AddAllItems implements Action {
  readonly type = ItemActionTypes.ADD_ALL_ITEMS;
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

export type ItemAction = AddOneItem|AddManyItems|AddAllItems|ItemAddLabelAction|ItemRemoveLabelAction;
