import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {StoreId} from '../../repository/utility/app-indexed-db';
import {UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {ContributorActionTypes, UpdateContributorsFromGithub} from './contributor.action';

@Injectable()
export class ContributorEffects {
  @Effect()
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateContributorsFromGithub>(ContributorActionTypes.UPDATE_FROM_GITHUB),
      map(action => {
        const updatePayload = {
          entities: action.payload.contributors,
          type: 'contributors' as StoreId
        };
        return new UpdateLocalDbEntities(updatePayload);
      }));

  constructor(private actions: Actions) {}
}
