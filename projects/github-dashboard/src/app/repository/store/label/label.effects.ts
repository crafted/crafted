import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, withLatestFrom} from 'rxjs/operators';
import {StoreId} from '../../utility/app-indexed-db';
import {AppState} from '../index';
import {RemoveAllItems} from '../item/item.action';
import {RemoveLocalDbEntities, UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {LabelActionTypes, UpdateLabelsFromGithub} from './label.action';
import {selectLabelIds} from './label.reducer';

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

  @Effect()
  persistRemoveAllToLocalDb = this.actions.pipe(
    ofType<RemoveAllItems>(LabelActionTypes.REMOVE_ALL),
    withLatestFrom(this.store.select(selectLabelIds)),
    map(([action, ids]) =>
      new RemoveLocalDbEntities({ids, type: 'labels' as StoreId})));


  constructor(private actions: Actions, private store: Store<AppState>) {}
}
