import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable, Subject, timer} from 'rxjs';
import {filter, map, take, takeUntil, tap} from 'rxjs/operators';
import {AppState} from '../../store';
import {AuthSignIn} from '../../store/auth/auth.action';
import {selectAuthState, selectCanAuth} from '../../store/auth/auth.reducer';


@Component({
  templateUrl: 'rate-limit-reached.html',
  styleUrls: ['rate-limit-reached.scss'],
})
export class RateLimitReached {
  secondsLeft: Observable<number>;

  secondsLeftMessage: Observable<string>;

  canAuth = this.store.select(selectCanAuth);

  private destroyed = new Subject();

  constructor(
      private store: Store<AppState>,
      @Inject(MAT_SNACK_BAR_DATA) public data: any,
      public snackBarRef: MatSnackBarRef<RateLimitReached>,
  ) {
    const resetSeconds = Math.ceil(data.reset - (new Date().getTime() / 1000));
    this.secondsLeft = timer(0, 1000).pipe(
        take(resetSeconds + 1), map(count => resetSeconds - count), tap(secondsRemaining => {
          if (secondsRemaining <= 0) {
            this.snackBarRef.dismiss();
          }
        }));

    this.secondsLeftMessage = this.secondsLeft.pipe(map(secondsLeft => {
      return secondsLeft > 60 ? Math.floor(secondsLeft / 60) + ' minutes' :
                                secondsLeft + ' seconds';
    }));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  signIn() {
    this.store.dispatch(new AuthSignIn());
    this.store.select(selectAuthState)
        .pipe(filter(authState => !!authState.accessToken), takeUntil(this.destroyed))
        .subscribe(() => {
          this.snackBarRef.dismiss();
        });
  }
}
