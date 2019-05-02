import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {UpdateAction} from './update-action';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  declarations: [UpdateAction],
  exports: [UpdateAction],
})
export class UpdateActionModule {
}
