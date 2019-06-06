import {Action} from '@ngrx/store';

export enum GitHubActionTypes {
  ADD_LABEL = '[GitHub] add label',
  REMOVE_LABEL = '[GitHub] remove label',
  ADD_ASSIGNEE = '[GitHub] add assignee',
  REMOVE_ASSIGNEE = '[GitHub] update entities',
  UPDATE_ITEM = '[GitHub] update item',
  UPDATE_LABELS = '[GitHub] update labels',
}

export class GitHubAddLabel implements Action {
  readonly type = GitHubActionTypes.ADD_LABEL;
  constructor(public payload: {id: string, label: string}) {}
}

export class GitHubRemoveLabel implements Action {
  readonly type = GitHubActionTypes.REMOVE_LABEL;
  constructor(public payload: {id: string, label: string}) {}
}

export class GitHubAddAssignee implements Action {
  readonly type = GitHubActionTypes.ADD_ASSIGNEE;
  constructor(public payload: {id: string, assignee: string}) {}
}

export class GitHubRemoveAssignee implements Action {
  readonly type = GitHubActionTypes.REMOVE_ASSIGNEE;
  constructor(public payload: {id: string, assignee: string}) {}
}

export class GitHubUpdateItem implements Action {
  readonly type = GitHubActionTypes.UPDATE_ITEM;
  constructor(public payload: {id: string}) {}
}

export class GitHubUpdateLabels implements Action {
  readonly type = GitHubActionTypes.UPDATE_LABELS;
}

export type GitHubActions =
  GitHubAddLabel|GitHubRemoveLabel|GitHubAddAssignee|GitHubRemoveAssignee|GitHubUpdateItem|GitHubUpdateLabels;
