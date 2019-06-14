import {createSelector} from '@ngrx/store';
import {RepositoryPermission} from '../../../github/github-types/permission';
import {getRepoState} from '../repo-state.selector';
import {PermissionAction, PermissionActionTypes} from './permission.action';

export function permissionActionReducer(
    state: RepositoryPermission = 'unknown', action: PermissionAction): RepositoryPermission {
  switch (action.type) {
    case PermissionActionTypes.SET:
      return action.payload.permission;

    default:
      return state;
  }
}

const selectRepositoryPermission = createSelector(getRepoState, repoState => repoState.permission);

export const selectHasWritePermissions = createSelector(
    selectRepositoryPermission, permission => permission === 'admin' || permission === 'write');
