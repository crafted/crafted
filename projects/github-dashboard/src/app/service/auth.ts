import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialog} from '@angular/material';
import {BehaviorSubject} from 'rxjs';
import {take} from 'rxjs/operators';
import {LoginDialog, LoginDialogResult} from './login-dialog/login-dialog';

export type GithubAuthScope = 'gist'|'repo';

@Injectable({providedIn: 'root'})
export class Auth {
  set token(token: string|null) {
    window.localStorage.setItem('accessToken', token || '');
    this.token$.next(token);
  }
  get token(): string|null {
    return window.localStorage.getItem('accessToken');
  }
  token$ = new BehaviorSubject<string|null>(this.token);

  set user(user: string|null) {
    window.localStorage.setItem('user', user || '');
    this.user$.next(user);
  }
  get user(): string|null {
    return window.localStorage.getItem('user');
  }
  user$ = new BehaviorSubject<string|null>(this.user);

  set scopes(scopes: string|null) {
    window.localStorage.setItem('scopes', scopes || '');
    this.scopes$.next(scopes);
  }
  get scopes(): string|null {
    return window.localStorage.getItem('scopes');
  }
  scopes$ = new BehaviorSubject<string|null>(this.scopes);

  constructor(private afAuth: AngularFireAuth, private dialog: MatDialog) {
    // Check if the URL location has the access token embedded
    const search = window.location.search;
    if (search) {
      let tokens = search.substring(1).split('&');
      tokens.forEach(token => {
        const key = token.split('=')[0];
        const value = token.split('=')[1];
        if (key === 'accessToken') {
          this.token = value;
        }
      });
    }
  }

  signIn(): Promise<void> {
    const config = {width: '450px'};
    return new Promise(resolve => {
      this.dialog.open<LoginDialog, null, LoginDialogResult>(LoginDialog, config)
          .afterClosed()
          .pipe(take(1))
          .subscribe(result => {
            if (result) {
              this.user = result.user;
              this.token = result.token;
            }
            resolve();
          });
    });
  }

  signOut() {
    this.token = '';
    this.afAuth.auth.signOut();
  }

  hasScope(scope: GithubAuthScope) {
    if (!this.scopes) {
      return false;
    }

    return new Set(this.scopes.split(',').map(v => v.trim())).has(scope);
  }
}
