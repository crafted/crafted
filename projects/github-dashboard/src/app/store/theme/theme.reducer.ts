import {createSelector} from '@ngrx/store';
import {AppState} from '../index';
import {ThemeAction, ThemeActionTypes} from './theme.action';
import {ThemeState} from './theme.state';

export enum THEME_STORAGE_KEY {
  IS_DARK_THEME = 'isDarkTheme',
}

const initialState: ThemeState = {
  isDark: window.localStorage.getItem(THEME_STORAGE_KEY.IS_DARK_THEME) === 'true' || true,
};

export function themeActionReducer(
    state: ThemeState = initialState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case ThemeActionTypes.SET:
      return {...state, ...action.payload};

    default:
      return state;
  }
}

export const selectThemeState = (state: AppState) => state.theme;

export const selectIsDarkTheme = createSelector(selectThemeState, themeState => themeState.isDark);
