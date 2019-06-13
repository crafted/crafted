import {Action} from '@ngrx/store';
import {Contributor} from '../../../github/app-types/contributor';

export enum ContributorActionTypes {
  UPDATE_FROM_GITHUB = '[Contributor] update from github',
  LOAD = '[Contributor] load',
  LOAD_COMPLETE = '[Contributor] load complete',
  REMOVE_ALL = '[Contributor] remove all',
}

export class UpdateContributorsFromGithub implements Action {
  readonly type = ContributorActionTypes.UPDATE_FROM_GITHUB;
  constructor(public payload: {contributors: Contributor[]}) {}
}

export class LoadContributors implements Action {
  readonly type = ContributorActionTypes.LOAD;
  constructor(public payload: {repository: string}) {}
}

export class LoadContributorsComplete implements Action {
  readonly type = ContributorActionTypes.LOAD_COMPLETE;
  constructor(public payload: {contributors: Contributor[]}) {}
}

export class RemoveAllContributors implements Action {
  readonly type = ContributorActionTypes.REMOVE_ALL;
}

export type ContributorAction = UpdateContributorsFromGithub|LoadContributors|
    RemoveAllContributors|LoadContributorsComplete;
