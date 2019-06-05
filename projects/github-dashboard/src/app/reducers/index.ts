import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import {itemActionReducer} from './item/item.reducer';
import {ItemState} from './item/item.state';

export interface State {
  items: ItemState;
}

export const reducers: ActionReducerMap<State> = {
  items: itemActionReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
