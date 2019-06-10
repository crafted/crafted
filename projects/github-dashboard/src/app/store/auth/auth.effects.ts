import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog} from '@angular/material';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {from} from 'rxjs';
import {map, mergeMap, switchMap, take} from 'rxjs/operators';
import {LoginDialog, LoginDialogResult} from '../../service/login-dialog/login-dialog';
import {AppState} from '../index';
import {
  AuthActionTypes,
  AuthSignIn,
  AuthSignInCancelled,
  AuthSignInSuccess,
  AuthSignOutSuccess
} from './auth.action';
import {selectAuthState} from './auth.reducer';
import {AuthState} from './auth.state';

@Injectable()
export class AuthEffects {
  @Effect()
  showSignInPrompt = this.actions.pipe(
      ofType<AuthSignIn>(AuthActionTypes.SIGN_IN), switchMap(() => {
        const config = {width: '450px'};
        return this.dialog.open<LoginDialog, null, LoginDialogResult>(LoginDialog, config)
            .afterClosed();
      }),
      map(result => {
        if (result) {
          return new AuthSignInSuccess({userName: result.user, accessToken: result.token});
        } else {
          return new AuthSignInCancelled({reason: 'dialog closed'});
        }
      }));

  @Effect({dispatch: false})
  persistAuthState = this.actions.pipe(
      ofType<AuthSignIn>(
          AuthActionTypes.SIGN_IN_SUCCESS, AuthActionTypes.UPDATE_SCOPES,
          AuthActionTypes.SIGN_OUT_SUCCESS),
      mergeMap(() => this.store.select(selectAuthState).pipe(take(1))),
      map(authState => saveAuthStateToStorage(authState)));

  @Effect()
  signOutFromFirebase = this.actions.pipe(
      ofType<AuthSignIn>(AuthActionTypes.SIGN_OUT),
      switchMap(() => from(this.afAuth.auth.signOut())), map(() => new AuthSignOutSuccess()));

  constructor(
      private actions: Actions, private store: Store<AppState>, private afAuth: AngularFireAuth,
      private dialog: MatDialog) {}
}

function saveAuthStateToStorage(authState: AuthState) {
  window.localStorage.setItem('accessToken', authState.accessToken || '');
  window.localStorage.setItem('user', authState.userName || '');
  window.localStorage.setItem('scopes', authState.scopes.join(', ') || '');
}
