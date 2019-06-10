import {createSelector} from '@ngrx/store';
import {AppState} from '../index';
import {LoadedReposAction, LoadedReposActionTypes} from './loaded-repos.action';
import {LoadedReposState} from './loaded-repos.state';

export enum LOADED_REPOS_STORAGE_KEY {
  LOADED_REPOS = 'loadedRepos',
}

const initialState: LoadedReposState = {
  loadedRepos: window.localStorage.getItem(LOADED_REPOS_STORAGE_KEY.LOADED_REPOS).split(','),
};

export function loadedReposActionReducer(
    state: LoadedReposState = initialState, action: LoadedReposAction): LoadedReposState {
  switch (action.type) {
    case LoadedReposActionTypes.ADD: {
      const reposSet = new Set(state.loadedRepos);
      reposSet.add(action.payload.repo);
      return {...state, loadedRepos: Array.from(reposSet)};
    }

    case LoadedReposActionTypes.REMOVE: {
      const reposSet = new Set(state.loadedRepos);
      reposSet.delete(action.payload.repo);
      return {...state, loadedRepos: Array.from(reposSet)};
    }

    default:
      return state;
  }
}

export const selectLoadedReposState = (state: AppState) => state.loadedRepos;

export const selectLoadedRepos =
    createSelector(selectLoadedReposState, loadedReposState => loadedReposState.loadedRepos);
export const selectIsRepoLoaded = repo =>
    createSelector(selectLoadedRepos, loadedRepos => loadedRepos.indexOf(repo) !== -1);
