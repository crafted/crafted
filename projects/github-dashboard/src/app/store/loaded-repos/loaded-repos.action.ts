import {Action} from '@ngrx/store';

export enum LoadedReposActionTypes {
  ADD = '[LoadedRepos] add',
  REMOVE = '[LoadedRepos] remove',
}

export class LoadedReposAdd implements Action {
  readonly type = LoadedReposActionTypes.ADD;
  constructor(public payload: {repo: string}) {}
}

export class LoadedReposRemove implements Action {
  readonly type = LoadedReposActionTypes.REMOVE;
  constructor(public payload: {repo: string}) {}
}

export type LoadedReposAction = LoadedReposAdd|LoadedReposRemove;
