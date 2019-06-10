import {Action} from '@ngrx/store';

export enum ThemeActionTypes {
  SET = '[Theme] set',
  TOGGLE = '[Theme] toggle',
}

export class ThemeSet implements Action {
  readonly type = ThemeActionTypes.SET;
  constructor(public payload: {isDark: boolean}) {}
}

export class ThemeToggle implements Action {
  readonly type = ThemeActionTypes.TOGGLE;
}

export type ThemeAction = ThemeSet|ThemeToggle;
