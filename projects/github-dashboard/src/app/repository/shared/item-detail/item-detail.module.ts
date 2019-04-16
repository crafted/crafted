import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatDividerModule, MatMenuModule} from '@angular/material';
import {TimeAgoPipeModule} from '../../../app.module';
import {LabelListModule} from '../label-list/label-list.module';
import {RecommendationActionModule} from '../recommendation-action/recommendation-action.module';
import {CommentViewModule} from './comment-view/comment-view.module';
import {ItemDetail} from './item-detail';
import {TimelineEventViewModule} from './timeline-event-view/timeline-event-view.module';

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    TimeAgoPipeModule,
    LabelListModule,
    MatMenuModule,
    MatButtonModule,
    CommentViewModule,
    RecommendationActionModule,
    TimelineEventViewModule,
  ],
  declarations: [ItemDetail],
  exports: [ItemDetail],
})
export class ItemDetailModule {
}
