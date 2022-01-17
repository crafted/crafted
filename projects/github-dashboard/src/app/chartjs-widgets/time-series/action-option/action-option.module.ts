import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
