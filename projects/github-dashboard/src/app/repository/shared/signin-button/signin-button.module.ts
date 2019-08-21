import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
