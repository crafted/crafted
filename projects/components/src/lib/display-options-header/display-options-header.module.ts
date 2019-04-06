import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {DisplayOptionsHeader} from './display-options-header';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [DisplayOptionsHeader],
  exports: [DisplayOptionsHeader]
})
export class DisplayOptionsHeaderModule {
}
