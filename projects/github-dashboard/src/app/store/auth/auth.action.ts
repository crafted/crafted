import {Action} from '@ngrx/store';

export enum AuthActionTypes {
  SIGN_IN = '[Auth] sign in',
  SIGN_IN_SUCCESS = '[Auth] sign in success',
  SIGN_IN_CANCELLED = '[Auth] sign in cancelled',
  SIGN_OUT = '[Auth] sign out',
  SIGN_OUT_SUCCESS = '[Auth] sign out success',
  UPDATE_SCOPES = '[Auth] update scopes',
  LOAD = '[Auth] load',
}

export class AuthSignIn implements Action {
  readonly type = AuthActionTypes.SIGN_IN;
}

export class AuthSignInSuccess implements Action {
  readonly type = AuthActionTypes.SIGN_IN_SUCCESS;
  constructor(public payload: {userName: string, accessToken: string}) {}
}

export class AuthSignInCancelled implements Action {
  readonly type = AuthActionTypes.SIGN_IN_CANCELLED;
  constructor(public payload: {reason: string}) {}
}

export class AuthSignOut implements Action {
  readonly type = AuthActionTypes.SIGN_OUT;
}

export class AuthSignOutSuccess implements Action {
  readonly type = AuthActionTypes.SIGN_OUT_SUCCESS;
}

export class AuthUpdateScopes implements Action {
  readonly type = AuthActionTypes.UPDATE_SCOPES;
  constructor(public payload: {scopes: string[]}) {}
}

export type AuthAction = AuthSignIn|AuthSignInSuccess|AuthSignInCancelled|AuthSignOut|
    AuthSignOutSuccess|AuthUpdateScopes;
