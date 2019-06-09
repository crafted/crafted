import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, withLatestFrom} from 'rxjs/operators';
import {StoreId} from '../../utility/app-indexed-db';
import {AppState} from '../index';
import {RemoveAllItems} from '../item/item.action';
import {RemoveLocalDbEntities, UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {ContributorActionTypes, UpdateContributorsFromGithub} from './contributor.action';
import {selectContributorIds} from './contributor.reducer';

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

  @Effect()
  persistRemoveAllToLocalDb = this.actions.pipe(
    ofType<RemoveAllItems>(ContributorActionTypes.REMOVE_ALL),
    withLatestFrom(this.store.select(selectContributorIds)),
    map(([action, ids]) =>
      new RemoveLocalDbEntities({ids, type: 'contributors' as StoreId})));


  constructor(private actions: Actions, private store: Store<AppState>) {}
}
