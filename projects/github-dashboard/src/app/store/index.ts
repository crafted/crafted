import {Type} from '@angular/core';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AuthEffects} from './auth/auth.effects';
import {authActionReducer} from './auth/auth.reducer';
import {AuthState} from './auth/auth.state';

export interface AppState {
  auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authActionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const effects: Type<any>[] = [
  AuthEffects
];
