import {Action} from '@ngrx/store';
import {Label} from '../../../github/app-types/label';

export enum LabelActionTypes {
  UPDATE_FROM_GITHUB = '[Label] update from github',
  LOAD_FROM_LOCAL_DB = '[Label] load from local db',
  REMOVE_ALL = '[Label] remove all',
}

export class UpdateLabelsFromGithub implements Action {
  readonly type = LabelActionTypes.UPDATE_FROM_GITHUB;
  constructor(public payload: {labels: Label[]}) {}
}

export class LoadLabelsFromLocalDb implements Action {
  readonly type = LabelActionTypes.LOAD_FROM_LOCAL_DB;
  constructor(public payload: {labels: Label[]}) {}
}

export class RemoveAllLabels implements Action {
  readonly type = LabelActionTypes.REMOVE_ALL;
}

export type LabelAction = UpdateLabelsFromGithub|LoadLabelsFromLocalDb|RemoveAllLabels;
