import {Component} from '@angular/core';
import {selectAuthState, selectCanAuth} from '../../../store/auth/auth.reducer';
import {AuthSignIn, AuthSignOut} from '../../../store/auth/auth.action';
import {Store} from '@ngrx/store';
import {AppState} from '../../store';
import {map} from 'rxjs/operators';

@Component({
  selector: 'signin-button',
  templateUrl: './signin-button.component.html',
  styleUrls: ['./signin-button.component.css']
})
export class SigninButtonComponent {
  canAuth = this.store.select(selectCanAuth);

  accessToken = this.store.select(selectAuthState).pipe(map(authState => authState.accessToken));

  user = this.store.select(selectAuthState).pipe(map(authState => authState.userName));

  constructor(private store: Store<AppState>) {}

  signIn() {
    this.store.dispatch(new AuthSignIn());
  }

  signOut() {
    this.store.dispatch(new AuthSignOut());
  }
}
