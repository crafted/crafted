import {Type} from '@angular/core';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AuthEffects} from './auth/auth.effects';
import {authActionReducer} from './auth/auth.reducer';
import {AuthState} from './auth/auth.state';
import {LoadedReposEffects} from './loaded-repos/loaded-repos.effects';
import {loadedReposActionReducer} from './loaded-repos/loaded-repos.reducer';
import {LoadedReposState} from './loaded-repos/loaded-repos.state';
import {ThemeEffects} from './theme/theme.effects';
import {themeActionReducer} from './theme/theme.reducer';
import {ThemeState} from './theme/theme.state';

export interface AppState {
  auth: AuthState;
  theme: ThemeState;
  loadedRepos: LoadedReposState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authActionReducer,
  theme: themeActionReducer,
  loadedRepos: loadedReposActionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

export const effects: Type<any>[] = [
  AuthEffects,
  ThemeEffects,
  LoadedReposEffects,
];
