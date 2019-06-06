import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {itemActionReducer} from './item/item.reducer';
import {ItemState} from './item/item.state';
import {repositoryActionReducer} from './repository/repository.reducer';
import {RepositoryState} from './repository/repository.state';

export interface AppState {
  repository: RepositoryState;
  items: ItemState;
}

export const reducers: ActionReducerMap<AppState> = {
  repository: repositoryActionReducer,
  items: itemActionReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
