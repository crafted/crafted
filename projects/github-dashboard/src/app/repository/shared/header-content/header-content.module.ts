import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {HeaderContent} from './header-content';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  declarations: [HeaderContent],
  exports: [HeaderContent],
})
export class HeaderContentModule {
}
