import {Type} from '@angular/core';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {contributorActionReducer} from './contributor/contributor.reducer';
import {ContributorState} from './contributor/contributor.state';
import {GithubEffects} from './github/github.effects';
import {ItemEffects} from './item/item.effects';
import {itemActionReducer} from './item/item.reducer';
import {ItemState} from './item/item.state';
import {LocalDbEffects} from './local-db/local-db.effects';
import {RepositoryEffects} from './repository/repository.effects';
import {repositoryActionReducer} from './repository/repository.reducer';
import {RepositoryState} from './repository/repository.state';

export interface AppState {
  repository: RepositoryState;
  items: ItemState;
  contributors: ContributorState;
}

export const reducers: ActionReducerMap<AppState> = {
  repository: repositoryActionReducer,
  items: itemActionReducer,
  contributors: contributorActionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const effects: Type<any>[] = [
  ItemEffects,
  LocalDbEffects,
  GithubEffects,
  RepositoryEffects,
];
