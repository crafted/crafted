import {Type} from '@angular/core';
import {ActionReducerMap} from '@ngrx/store';
import {AppState as RootAppState} from '../../store';
import {ContributorEffects} from './contributor/contributor.effects';
import {contributorActionReducer} from './contributor/contributor.reducer';
import {ContributorState} from './contributor/contributor.state';
import {DashboardEffects} from './dashboard/dashboard.effects';
import {dashboardActionReducer} from './dashboard/dashboard.reducer';
import {DashboardState} from './dashboard/dashboard.state';
import {ItemEffects} from './item/item.effects';
import {itemActionReducer} from './item/item.reducer';
import {ItemState} from './item/item.state';
import {LabelEffects} from './label/label.effects';
import {labelActionReducer} from './label/label.reducer';
import {LabelState} from './label/label.state';
import {QueryEffects} from './query/query.effects';
import {queryActionReducer} from './query/query.reducer';
import {QueryState} from './query/query.state';
import {RecommendationEffects} from './recommendation/recommendation.effects';
import {recommendationActionReducer} from './recommendation/recommendation.reducer';
import {RecommendationState} from './recommendation/recommendation.state';
import {RepositoryEffects} from './repository/repository.effects';
import {repositoryActionReducer} from './repository/repository.reducer';
import {RepositoryState} from './repository/repository.state';

export interface RepoState {
  repository: RepositoryState; // rename to name
  items: ItemState;
  contributors: ContributorState;
  labels: LabelState;
  dashboards: DashboardState;
  queries: QueryState;
  recommendations: RecommendationState;
}

export const reducers: ActionReducerMap<RepoState> = {
  repository: repositoryActionReducer,
  items: itemActionReducer,
  contributors: contributorActionReducer,
  labels: labelActionReducer,
  dashboards: dashboardActionReducer,
  queries: queryActionReducer,
  recommendations: recommendationActionReducer,
};

export interface AppState extends RootAppState {
  repository: RepoState;
}

export const effects: Type<any>[] = [
  ItemEffects,
  RepositoryEffects,
  ContributorEffects,
  LabelEffects,
  DashboardEffects,
  RecommendationEffects,
  QueryEffects,
];
