import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {RepositoryPermission} from '../../../github/github-types/permission';
import {Github} from '../../../service/github';
import {AppState} from '../index';
import {
  LoadRepositoryPermission,
  PermissionActionTypes,
  SetRepositoryPermission
} from './permission.action';

@Injectable()
export class PermissionEffects {
  @Effect()
  load = this.actions.pipe(
      ofType<LoadRepositoryPermission>(PermissionActionTypes.LOAD), switchMap(action => {
        if (!action.payload.repository || !action.payload.user) {
          return of('unknown' as RepositoryPermission);
        }
        return this.github.getRepositoryPermission(action.payload.repository, action.payload.user);
      }),
      map(permission => new SetRepositoryPermission({permission})));

  constructor(private actions: Actions, private store: Store<AppState>, private github: Github) {}
}
