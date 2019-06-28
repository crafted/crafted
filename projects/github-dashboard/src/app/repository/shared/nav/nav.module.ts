import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {Nav} from './nav';
import {SigninButtonModule} from '../signin-button/signin-button.module'


@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
    SigninButtonModule,
  ],
  declarations: [Nav],
  exports: [Nav],
})
export class NavModule {
}
