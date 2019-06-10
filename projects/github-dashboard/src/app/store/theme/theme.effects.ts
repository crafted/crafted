import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, take, tap} from 'rxjs/operators';
import {Config} from '../../service/config';
import {AppState} from '../index';
import {ThemeActionTypes, ThemeSet, ThemeToggle} from './theme.action';
import {selectThemeState, THEME_STORAGE_KEY} from './theme.reducer';
import {ThemeState} from './theme.state';

@Injectable()
export class ThemeEffects {
  @Effect()
  convertToggleToSet = this.actions.pipe(
      ofType<ThemeToggle>(ThemeActionTypes.TOGGLE),
      mergeMap(() => this.store.select(selectThemeState).pipe(take(1))),
    map(themeState => new ThemeSet({isDark: !themeState.isDark})));

  @Effect({dispatch: false})
  applyClassesToDocumentBody = this.actions.pipe(
      ofType<ThemeSet>(ThemeActionTypes.SET),
      tap(action => setThemeClasses(action.payload.isDark)));

  @Effect({dispatch: false})
  persistThemeToStorage = this.actions.pipe(
      ofType<ThemeToggle>(ThemeActionTypes.SET),
      mergeMap(() => this.store.select(selectThemeState).pipe(take(1))),
      tap(saveThemeStateToStorage));


  @Effect({dispatch: false})
  persistThemeToGist = this.actions.pipe(
      ofType<ThemeToggle>(ThemeActionTypes.SET),
      mergeMap(() => this.store.select(selectThemeState).pipe(take(1))),
      tap(themeState => this.config.saveDashboardConfig({useDarkTheme: themeState.isDark})));

  constructor(private actions: Actions, private store: Store<AppState>, private config: Config) {}
}

function setThemeClasses(isDark: boolean) {
  if (isDark) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }
}

function saveThemeStateToStorage(themeState: ThemeState) {
  window.localStorage.setItem(
      THEME_STORAGE_KEY.IS_DARK_THEME, themeState.isDark ? 'true' : 'false');
}
