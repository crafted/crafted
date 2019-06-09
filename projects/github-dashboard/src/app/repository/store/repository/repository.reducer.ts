import {createSelector} from '@ngrx/store';
import {RepoState} from '../index';
import {getRepoState} from '../repo-state.selector';
import {RepositoryAction, RepositoryActionTypes} from './repository.action';
import {RepositoryState} from './repository.state';

const initialState: RepositoryState = {
  name: '',
};

export function repositoryActionReducer(
    state: RepositoryState = initialState, action: RepositoryAction): RepositoryState {
  switch (action.type) {
    case RepositoryActionTypes.LOAD:
      return {...state, name: action.payload.name};

    default:
      return state;
  }
}

export const selectRepositoryName =
    createSelector(getRepoState, (state: RepoState) => state.repository.name);
