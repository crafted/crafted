import {Action} from '@ngrx/store';
import {Label} from '../../../github/app-types/label';

export enum LabelActionTypes {
  UPDATE_FROM_GITHUB = '[Label] update from github',
  LOAD = '[Label] load ',
  LOAD_COMPLETE = '[Label] load complete',
  REMOVE_ALL = '[Label] remove all',
}

export class UpdateLabelsFromGithub implements Action {
  readonly type = LabelActionTypes.UPDATE_FROM_GITHUB;
  constructor(public payload: {labels: Label[]}) {}
}

export class LoadLabels implements Action {
  readonly type = LabelActionTypes.LOAD;
  constructor(public payload: {repository: string}) {}
}

export class LoadLabelsComplete implements Action {
  readonly type = LabelActionTypes.LOAD_COMPLETE;
  constructor(public payload: {labels: Label[]}) {}
}

export class RemoveAllLabels implements Action {
  readonly type = LabelActionTypes.REMOVE_ALL;
}

export type LabelAction = UpdateLabelsFromGithub|LoadLabels|RemoveAllLabels|LoadLabelsComplete;
