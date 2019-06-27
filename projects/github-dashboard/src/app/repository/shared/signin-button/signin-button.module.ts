import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {SigninButtonComponent} from './signin-button.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [SigninButtonComponent],
  exports: [SigninButtonComponent],
})
export class SigninButtonModule {
}
