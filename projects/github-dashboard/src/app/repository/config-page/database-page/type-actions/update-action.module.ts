import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {UpdateAction} from './update-action';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  declarations: [UpdateAction],
  exports: [UpdateAction],
})
export class UpdateActionModule {
}
