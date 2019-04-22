import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {WidgetEditModule} from '../widget/widget-edit/widget-edit.module';
import {WidgetViewModule} from '../widget/widget-view/widget-view.module';
import {DashboardView} from './dashboard-view';

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
