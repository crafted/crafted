import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import {Nav} from './nav';


@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [Nav],
  exports: [Nav],
})
export class NavModule {
}
