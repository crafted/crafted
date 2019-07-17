import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LabelListModule} from '../../label-list/label-list.module';
import {TimelineEventView} from './timeline-event-view';

@NgModule({
  imports: [CommonModule, LabelListModule],
  declarations: [TimelineEventView],
  exports: [TimelineEventView],
})
export class TimelineEventViewModule {
}
