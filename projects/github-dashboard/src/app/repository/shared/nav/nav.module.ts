import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {Nav} from './nav';
import {SigninButtonModule} from '../signin-button/signin-button.module'


@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
    SigninButtonModule,
  ],
  declarations: [Nav],
  exports: [Nav],
})
export class NavModule {
}
