import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';

import {RepositoryDatabase} from '../../../service/repository-database';
import {createId} from '../../../utility/create-id';
import {AppState} from '../index';
import {ItemActionTypes} from '../item/item.action';
import {selectRepositoryName} from '../name/name.reducer';

import {
  CreateRecommendation,
  LoadRecommendations,
  LoadRecommendationsComplete,
  RecommendationActionTypes,
  RemoveRecommendation,
  SyncRecommendations,
  UpdateRecommendation,
  UpsertRecommendations
} from './recommendation.action';
import {selectRecommendationEntities} from './recommendation.reducer';

@Injectable()
export class RecommendationEffects {
  @Effect()
  load = this.actions.pipe(
      ofType<LoadRecommendations>(ItemActionTypes.LOAD),
      switchMap(action => {
        return this.repositoryDatabase.getValues(action.payload.repository)
            .recommendations.pipe(
                take(1),
                map(recommendations =>
                        new LoadRecommendationsComplete({recommendations})));
      }));

  @Effect()
  createNewRecommendation = this.actions.pipe(
      ofType<CreateRecommendation>(RecommendationActionTypes.CREATE_RECOMMENDATION), map(action => {
        const newRecommendation = {
          id: createId(),
          dbAdded: new Date().toISOString(),
          ...action.payload.recommendation,
        };

        return new UpsertRecommendations({recommendations: [newRecommendation]});
      }));

  @Effect()
  update = this.actions.pipe(
      ofType<UpdateRecommendation>(RecommendationActionTypes.UPDATE_RECOMMENDATION),
      withLatestFrom(this.store.select(selectRecommendationEntities)),
      map(([action, recommendations]) => {
        const recommendation = {
          ...recommendations[action.payload.update.id],
          ...action.payload.update.changes,
        };

        return new UpsertRecommendations({recommendations: [recommendation]});
      }));

  @Effect({dispatch: false})
  persistUpsert = this.actions.pipe(
      ofType<UpsertRecommendations>(RecommendationActionTypes.UPSERT_RECOMMENDATIONS),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.update(
            repository, 'recommendations', action.payload.recommendations);
      }));

  @Effect({dispatch: false})
  persistRemove = this.actions.pipe(
      ofType<RemoveRecommendation>(RecommendationActionTypes.REMOVE),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.remove(repository, 'recommendations', [action.payload.id]);
      }));

  @Effect({dispatch: false})
  sync = this.actions.pipe(
      ofType<SyncRecommendations>(RecommendationActionTypes.SYNC),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        if (action.payload.remove.length) {
          this.repositoryDatabase.remove(repository, 'recommendations', action.payload.remove);
        }

        if (action.payload.update.length) {
          this.repositoryDatabase.update(repository, 'recommendations', action.payload.update);
        }
      }));

  constructor(
      private actions: Actions, private store: Store<AppState>,
      private repositoryDatabase: RepositoryDatabase) {}
}
