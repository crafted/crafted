import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {LabelListModule} from '../label-list/label-list.module';
import {RecommendationActionModule} from '../recommendation-action/recommendation-action.module';
import {ItemDetail} from './item-detail';
import {ItemMessageModule} from './message/item-message.module';
import {TimelineEventViewModule} from './timeline-event-view/timeline-event-view.module';

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    LabelListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ItemMessageModule,
    RecommendationActionModule,
    TimelineEventViewModule,
    MatProgressSpinnerModule,
  ],
  declarations: [ItemDetail],
  exports: [ItemDetail],
})
export class ItemDetailModule {
}
