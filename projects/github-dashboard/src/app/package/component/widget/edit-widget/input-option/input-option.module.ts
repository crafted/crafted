import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {InputOption} from './input-option';

@NgModule({
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  declarations: [InputOption],
  exports: [InputOption],
})
export class InputOptionModule {
}
