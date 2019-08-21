import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
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
