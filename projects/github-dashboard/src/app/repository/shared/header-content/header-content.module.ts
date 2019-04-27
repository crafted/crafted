import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatTooltipModule} from '@angular/material';
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
