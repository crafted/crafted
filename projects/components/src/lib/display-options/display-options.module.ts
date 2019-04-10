import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {DisplayOptions} from './display-options';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [DisplayOptions],
  exports: [DisplayOptions]
})
export class DisplayOptionsModule {
}
