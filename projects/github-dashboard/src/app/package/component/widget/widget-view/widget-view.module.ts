import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {WidgetView} from './widget-view';


@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    PortalModule,
  ],
  declarations: [WidgetView],
  exports: [WidgetView],
})
export class WidgetViewModule {
}
