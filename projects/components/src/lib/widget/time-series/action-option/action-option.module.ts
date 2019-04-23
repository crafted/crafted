import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatSelectModule} from '@angular/material';
import {ActionOption} from './action-option';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  declarations: [ActionOption],
  exports: [ActionOption],
  entryComponents: [ActionOption]
})
export class ActionOptionModule {
}
