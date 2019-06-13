import {createSelector} from '@ngrx/store';
import {RepoState} from '../index';
import {getRepoState} from '../repo-state.selector';
import {RepositoryAction, RepositoryActionTypes} from './repository.action';

export function nameActionReducer(state = '', action: RepositoryAction): string {
  switch (action.type) {
    case RepositoryActionTypes.SET_NAME:
      return action.payload.repository;

    default:
      return state;
  }
}

export const selectRepositoryName = createSelector(getRepoState, (state: RepoState) => state.name);
