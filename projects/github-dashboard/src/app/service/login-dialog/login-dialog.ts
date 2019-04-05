import {ChangeDetectionStrategy, Component, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {auth} from 'firebase/app';
import {GithubAuthScope} from '../auth';

export interface LoginDialogResult {
  user: string;
  token: string;
}

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
  styleUrls: ['login-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialog {
  enableGist = new FormControl(true);
  enableRepo = new FormControl(true);

  constructor(
      private dialogRef: MatDialogRef<LoginDialog>, private ngZone: NgZone,
      private afAuth: AngularFireAuth) {}

  signIn() {
    const scopes: GithubAuthScope[] = [];
    if (this.enableGist.value) {
      scopes.push('gist');
    }
    if (this.enableRepo.value) {
      scopes.push('repo');
    }

    const provider = new auth.GithubAuthProvider();
    scopes.forEach(scope => provider.addScope(scope));

    return this.afAuth.auth.signInWithPopup(provider)
        .then(result => {
          if (!result) {
            this.dialogRef.close(null);
          }

          this.ngZone.run(() => {
            this.dialogRef.close({
              user: result.additionalUserInfo!.username as string,
              token: (result!.credential! as any).accessToken as string
            });
          });
        })
        .catch(e => {
          throw e;
        });
  }
}
