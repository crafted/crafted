import {createSelector} from '@ngrx/store';
import {RepoState} from '../index';
import {getRepoState} from '../repo-state.selector';
import {NameAction, RepositoryActionTypes} from './name.action';

export function nameActionReducer(state = '', action: NameAction): string {
  switch (action.type) {
    case RepositoryActionTypes.SET_NAME:
      return action.payload.repository;

    default:
      return state;
  }
}

export const selectRepositoryName = createSelector(getRepoState, (state: RepoState) => state.name);
