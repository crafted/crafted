import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TimeAgoPipeModule} from 'projects/github-dashboard/src/app/app.module';
import {LabelListModule} from '../../label-list/label-list.module';
import {TimelineEventView} from './timeline-event-view';

@NgModule({
  imports: [CommonModule, TimeAgoPipeModule, LabelListModule],
  declarations: [TimelineEventView],
  exports: [TimelineEventView],
})
export class TimelineEventViewModule {
}
