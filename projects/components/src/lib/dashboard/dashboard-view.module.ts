import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {DashboardView} from './dashboard-view';
import {WidgetEditModule} from './widget-edit/widget-edit.module';
import {WidgetViewModule} from './widget-view/widget-view.module';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    WidgetEditModule,
    WidgetViewModule,
  ],
  declarations: [DashboardView],
  exports: [DashboardView],
})
export class DashboardViewModule {
}
