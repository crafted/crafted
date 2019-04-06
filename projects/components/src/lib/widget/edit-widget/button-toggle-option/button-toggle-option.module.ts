import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material';
import {ButtonToggleGroupOption} from './button-toggle-option';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule, ReactiveFormsModule],
  declarations: [ButtonToggleGroupOption],
  exports: [ButtonToggleGroupOption],
})
export class ButtonToggleGroupOptionModule {
}
