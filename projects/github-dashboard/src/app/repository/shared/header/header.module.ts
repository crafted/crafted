import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatToolbarModule
} from '@angular/material';
import {SeasonHeader} from './header';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    PortalModule,
    MatIconModule,
    MatDividerModule,
  ],
  declarations: [SeasonHeader],
  exports: [SeasonHeader],
})
export class HeaderModule {
}
