import {ChangeDetectionStrategy, Component, Inject, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {auth} from 'firebase/app';
import {
  DeleteConfirmationData
} from '../../repository/shared/dialog/delete-confirmation/delete-confirmation';
import {GithubAuthScope} from '../../store/auth/auth.reducer';

export interface LoadRepositoryData {
  name: string;
}

@Component({
  templateUrl: 'load-repository.html',
  styleUrls: ['load-repository.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadRepository {
  constructor(@Inject(MAT_DIALOG_DATA) public data: LoadRepositoryData) {}
}
