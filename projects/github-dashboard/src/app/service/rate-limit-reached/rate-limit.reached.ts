import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';
import {Observable, timer} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';

import {Auth} from '../auth';


@Component({
  templateUrl: 'rate-limit-reached.html',
  styleUrls: ['rate-limit-reached.scss'],
})
export class RateLimitReached {
  secondsLeft: Observable<number>;

  secondsLeftMessage: Observable<string>;

  constructor(
      public auth: Auth,
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

  signIn() {
    this.auth.signIn().then(() => {
      this.snackBarRef.dismiss();
    });
  }
}
