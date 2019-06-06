import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {LoadLocalDb} from '../local-db/local-db.actions';

import {RepositoryActionTypes} from './repository.action';

@Injectable()
export class RepositoryEffects {
  @Effect()
  load = this.actions.pipe(
      ofType(RepositoryActionTypes.LOAD_REPOSITORY),
      map(() => new LoadLocalDb()));

  constructor(private actions: Actions) {}
}
