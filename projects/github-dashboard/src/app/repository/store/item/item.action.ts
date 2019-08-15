import {Action} from '@ngrx/store';
import {Item} from '../../../github/app-types/item';

export enum ItemActionTypes {
  UPDATE_ITEMS_FROM_GITHUB = '[Item] update items from github',
  LOAD = '[Item] load ',
  LOAD_COMPLETE = '[Item] load complete',
  ADD_LABEL = '[Item] add label',
  ADD_LABEL_FAILED = '[Item] add label failed',
  REMOVE_LABEL = '[Item] remove label',
  REMOVE_LABEL_FAILED = '[Item] remove label failed',
  ADD_ASSIGNEE = '[Item] add assignee',
  ADD_ASSIGNEE_FAILED = '[Item] add assignee failed',
  REMOVE_ASSIGNEE = '[Item] remove assignee',
  REMOVE_ASSIGNEE_FAILED = '[Item] remove assignee failed',
  REMOVE_ALL = '[Item] remove all',
  UPDATE_TITLE = '[Item] update title',
  UPDATE_TITLE_FAILED = '[Item] update title failed',
}

export class UpdateItemsFromGithub implements Action {
  readonly type = ItemActionTypes.UPDATE_ITEMS_FROM_GITHUB;
  constructor(public payload: {items: Item[]}) {}
}

export class LoadItems implements Action {
  readonly type = ItemActionTypes.LOAD;
  constructor(public payload: {repository: string}) {}
}

export class LoadItemsComplete implements Action {
  readonly type = ItemActionTypes.LOAD_COMPLETE;
  constructor(public payload: {items: Item[]}) {}
}

export class ItemAddLabelAction implements Action {
  readonly type = ItemActionTypes.ADD_LABEL;
  constructor(public payload: {itemId: string, labelName: string, labelId: string}) {}
}

export class ItemAddLabelFailedAction {
  readonly type = ItemActionTypes.ADD_LABEL_FAILED;
  constructor(public payload: {itemId: string, labelName: string, labelId: string}) {}
}

export class ItemRemoveLabelAction implements Action {
  readonly type = ItemActionTypes.REMOVE_LABEL;
  constructor(public payload: {itemId: string, labelName: string, labelId: string}) {}
}

export class ItemRemoveLabelFailedAction {
  readonly type = ItemActionTypes.REMOVE_LABEL_FAILED;
  constructor(public payload: {itemId: string, labelName: string, labelId: string}) {}
}

export class ItemAddAssigneeAction implements Action {
  readonly type = ItemActionTypes.ADD_ASSIGNEE;
  constructor(public payload: {itemId: string, assignee: string}) {}
}

export class ItemAddAssigneeFailedAction {
  readonly type = ItemActionTypes.ADD_ASSIGNEE_FAILED;
  constructor(public payload: {itemId: string, assignee: string}) {}
}

export class ItemRemoveAssigneeAction implements Action {
  readonly type = ItemActionTypes.REMOVE_ASSIGNEE;
  constructor(public payload: {itemId: string, assignee: string}) {}
}

export class ItemRemoveAssigneeFailedAction {
  readonly type = ItemActionTypes.REMOVE_ASSIGNEE_FAILED;
  constructor(public payload: {itemId: string, assignee: string}) {}
}

export class ItemUpdateTitleAction {
  readonly type = ItemActionTypes.UPDATE_TITLE;
  constructor(public payload: {itemId: string, oldTitle: string, newTitle: string}) {}
}

export class ItemUpdateTitleFailedAction {
  readonly type = ItemActionTypes.UPDATE_TITLE_FAILED;
  constructor(public payload: {itemId: string, oldTitle: string, newTitle: string}) {}
}

export class RemoveAllItems implements Action {
  readonly type = ItemActionTypes.REMOVE_ALL;
}

export type ItemAction =
    UpdateItemsFromGithub|ItemAddLabelAction|ItemRemoveLabelAction|LoadItems|
    ItemAddAssigneeAction|ItemRemoveAssigneeAction|RemoveAllItems|LoadItemsComplete|ItemUpdateTitleAction|ItemUpdateTitleFailedAction;
