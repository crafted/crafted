import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {RouterModule} from '@angular/router';
import {LoadingModule} from '../repository/shared/loading/loading.module';
import {HomePage} from './home-page';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingModule,
  ],
  declarations: [HomePage],
  exports: [HomePage],
})
export class LoginModule {
}
