import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';

import {StoreId} from '../../repository/utility/app-indexed-db';
import {createId} from '../../utility/create-id';
import {AppState} from '../index';
import {RemoveLocalDbEntities, UpdateLocalDbEntities} from '../local-db/local-db.actions';

import {
  CreateRecommendation,
  RecommendationActionTypes,
  RemoveRecommendation,
  SyncRecommendations,
  UpdateRecommendation,
  UpsertRecommendations
} from './recommendation.action';

@Injectable()
export class RecommendationEffects {
  @Effect()
  createNewRecommendation = this.actions.pipe(
      ofType<CreateRecommendation>(RecommendationActionTypes.CREATE_RECOMMENDATION), map(action => {
        const newRecommendation = {id: createId(), ...action.payload.recommendation};

        return new UpsertRecommendations({recommendations: [newRecommendation]});
      }));

  @Effect()
  update = this.actions.pipe(
      ofType<UpdateRecommendation>(RecommendationActionTypes.UPDATE_RECOMMENDATION),
      withLatestFrom(this.store.select(state => state.recommendations.entities)),
      map(([action, recommendations]) => {
        const recommendation = {
          ...recommendations[action.payload.update.id],
          ...action.payload.update.changes,
        };

        return new UpsertRecommendations({recommendations: [recommendation]});
      }));

  @Effect()
  persistUpsert = this.actions.pipe(
      ofType<UpsertRecommendations>(RecommendationActionTypes.UPSERT_RECOMMENDATIONS),
      map(action => {
        const updatePayload = {
          entities: action.payload.recommendations,
          type: 'recommendations' as StoreId
        };
        return new UpdateLocalDbEntities(updatePayload);
      }));

  @Effect()
  persistRemove = this.actions.pipe(
      ofType<RemoveRecommendation>(RecommendationActionTypes.REMOVE),
      map(action => new RemoveLocalDbEntities(
              {ids: [action.payload.id], type: 'recommendations' as StoreId})));

  @Effect()
  sync = this.actions.pipe(
      ofType<SyncRecommendations>(RecommendationActionTypes.SYNC), switchMap(action => {
        const actions = [];

        if (action.payload.remove.length) {
          actions.push(new RemoveLocalDbEntities(
              {ids: [action.payload.remove], type: 'recommendations' as StoreId}));
        }

        if (action.payload.update.length) {
          actions.push(new UpdateLocalDbEntities(
              {entities: [action.payload.update], type: 'recommendations' as StoreId}));
        }

        return actions;
      }));

  constructor(private actions: Actions, private store: Store<AppState>) {}
}
