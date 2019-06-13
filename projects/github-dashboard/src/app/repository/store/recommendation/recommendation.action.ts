import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {Recommendation} from '../../model/recommendation';

export enum RecommendationActionTypes {
  CREATE_RECOMMENDATION = '[Recommendation] create recommendation',
  UPDATE_RECOMMENDATION = '[Recommendation] update recommendation',
  UPSERT_RECOMMENDATIONS = '[Recommendation] upsert recommendations',
  LOAD = '[Recommendation] load',
  LOAD_COMPLETE = '[Recommendation] load complete',
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

export class LoadRecommendations implements Action {
  readonly type = RecommendationActionTypes.LOAD;
  constructor(public payload: {repository: string}) {}
}

export class LoadRecommendationsComplete implements Action {
  readonly type = RecommendationActionTypes.LOAD_COMPLETE;
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
    LoadRecommendations|RemoveRecommendation|LoadRecommendationsComplete;
