import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {Recommendation} from '../../model/recommendation';
import {getRepoState} from '../repo-state.selector';
import {RecommendationAction, RecommendationActionTypes} from './recommendation.action';
import {RecommendationState} from './recommendation.state';

export const entityAdapter: EntityAdapter<Recommendation> = createEntityAdapter<Recommendation>();

const initialState: RecommendationState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
  loading: false,
};

// TODO: Add created and modified date
export function recommendationActionReducer(
    state: RecommendationState = initialState, action: RecommendationAction): RecommendationState {
  switch (action.type) {
    case RecommendationActionTypes.UPSERT_RECOMMENDATIONS:
      const recommendations = action.payload.recommendations.map(r => {
        return {...r, dbModified: new Date().toISOString()};
      });
      return entityAdapter.upsertMany(recommendations, state);

    case RecommendationActionTypes.LOAD:
      return {...state, loading: true};

    case RecommendationActionTypes.LOAD_COMPLETE:
      state = {...state, loading: false};
      return entityAdapter.addAll(action.payload.recommendations, state);

    case RecommendationActionTypes.REMOVE:
      return entityAdapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}

const {selectEntities, selectAll} = entityAdapter.getSelectors();

const selectRecommendationState =
    createSelector(getRepoState, repoState => repoState.recommendations);

export const selectRecommendationEntities =
    createSelector(selectRecommendationState, selectEntities);
export const selectRecommendations = createSelector(selectRecommendationState, selectAll);
export const selectRecommendationsLoading =
  createSelector(selectRecommendationState, state => state.loading);
