import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {TypeActions} from './type-actions';


@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  declarations: [TypeActions],
  exports: [TypeActions],
})
export class TypeActionsModule {
}
