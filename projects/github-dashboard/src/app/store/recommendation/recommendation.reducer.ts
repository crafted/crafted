import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Recommendation} from '../../repository/model/recommendation';
import {RecommendationAction, RecommendationActionTypes} from './recommendation.action';
import {RecommendationState} from './recommendation.state';

export const entityAdapter: EntityAdapter<Recommendation> =
  createEntityAdapter<Recommendation>();

const initialState: RecommendationState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
};

// TODO: Add created and modified date
export function recommendationActionReducer(state: RecommendationState = initialState, action: RecommendationAction): RecommendationState {
  switch (action.type) {
    case RecommendationActionTypes.UPSERT_RECOMMENDATIONS:
      action.payload.recommendations.forEach(o => o.dbModified = new Date().toISOString());
      return entityAdapter.upsertMany(action.payload.recommendations, state);

    case RecommendationActionTypes.LOAD_FROM_LOCAL_DB:
      return entityAdapter.addAll(action.payload.recommendations, state);

    case RecommendationActionTypes.REMOVE:
      return entityAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}

export const selectAllRecommendations = entityAdapter.getSelectors().selectAll;
