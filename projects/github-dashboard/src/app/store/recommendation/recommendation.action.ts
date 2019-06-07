import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {Recommendation} from '../../repository/model/recommendation';

export enum RecommendationActionTypes {
  CREATE_RECOMMENDATION = '[Recommendation] create recommendation',
  UPDATE_RECOMMENDATION = '[Recommendation] update recommendation',
  UPSERT_RECOMMENDATIONS = '[Recommendation] upsert recommendations',
  LOAD_FROM_LOCAL_DB = '[Recommendation] load from local db',
  REMOVE = '[Recommendation] remove',
  SYNC = '[Recommendation] sync',
}

export class CreateRecommendation implements Action {
  readonly type = RecommendationActionTypes.CREATE_RECOMMENDATION;
  constructor(public payload: {recommendation: Partial<Recommendation>}) {}
}

export class UpdateRecommendation implements Action {
  readonly type = RecommendationActionTypes.UPDATE_RECOMMENDATION;
  constructor(public payload: {update: Update<Recommendation>}) {}
}

export class UpsertRecommendations implements Action {
  readonly type = RecommendationActionTypes.UPSERT_RECOMMENDATIONS;
  constructor(public payload: {recommendations: Recommendation[]}) {}
}

export class LoadRecommendationsFromLocalDb implements Action {
  readonly type = RecommendationActionTypes.LOAD_FROM_LOCAL_DB;
  constructor(public payload: {recommendations: Recommendation[]}) {}
}

export class RemoveRecommendation implements Action {
  readonly type = RecommendationActionTypes.REMOVE;
  constructor(public payload: {id: string}) {}
}

export class SyncRecommendations implements Action {
  readonly type = RecommendationActionTypes.SYNC;
  constructor(public payload: {update: Update<Recommendation>[], remove: string[]}) {}
}

export type RecommendationAction = CreateRecommendation|UpdateRecommendation|UpsertRecommendations|
    LoadRecommendationsFromLocalDb|RemoveRecommendation;
