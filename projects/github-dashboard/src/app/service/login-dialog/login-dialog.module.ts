import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatDialogModule} from '@angular/material';
import {LoginDialog} from './login-dialog';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginDialog],
  exports: [LoginDialog],
  entryComponents: [LoginDialog]
})
export class LoginDialogModule {
}
