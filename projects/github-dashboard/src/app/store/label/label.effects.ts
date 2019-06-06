import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {StoreId} from '../../repository/utility/app-indexed-db';
import {UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {LabelActionTypes, UpdateLabelsFromGithub} from './label.action';

@Injectable()
export class LabelEffects {
  @Effect()
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateLabelsFromGithub>(LabelActionTypes.UPDATE_FROM_GITHUB),
      map(action => {
        const updatePayload = {
          entities: action.payload.labels,
          type: 'labels' as StoreId
        };
        return new UpdateLocalDbEntities(updatePayload);
      }));

  constructor(private actions: Actions) {}
}
