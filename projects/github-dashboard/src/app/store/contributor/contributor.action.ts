import {Action} from '@ngrx/store';
import {Contributor} from '../../github/app-types/contributor';

export enum ContributorActionTypes {
  UPDATE_FROM_GITHUB = '[Contributor] update from github',
  LOAD_FROM_LOCAL_DB = '[Contributor] load from local db',
  REMOVE_ALL = '[Contributor] remove all',
}

export class UpdateContributorsFromGithub implements Action {
  readonly type = ContributorActionTypes.UPDATE_FROM_GITHUB;
  constructor(public payload: {contributors: Contributor[]}) {}
}

export class LoadContributorsFromLocalDb implements Action {
  readonly type = ContributorActionTypes.LOAD_FROM_LOCAL_DB;
  constructor(public payload: {contributors: Contributor[]}) {}
}

export class RemoveAllContributors implements Action {
  readonly type = ContributorActionTypes.REMOVE_ALL;
}

export type ContributorAction = UpdateContributorsFromGithub|LoadContributorsFromLocalDb|RemoveAllContributors;
