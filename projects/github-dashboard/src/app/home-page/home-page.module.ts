import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {LoadingModule} from '../repository/shared/loading/loading.module';
import {HomePage} from './home-page';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingModule,
  ],
  declarations: [HomePage],
  exports: [HomePage],
})
export class LoginModule {
}
