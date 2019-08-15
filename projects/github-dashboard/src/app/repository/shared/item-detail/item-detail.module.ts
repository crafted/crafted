import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {LabelListModule} from '../label-list/label-list.module';
import {RecommendationActionModule} from '../recommendation-action/recommendation-action.module';
import {ItemDetail} from './item-detail';
import {ItemTitleModule} from './item-title/item-title.module';
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
    MatInputModule,
    ItemMessageModule,
    RecommendationActionModule,
    TimelineEventViewModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ItemTitleModule,
  ],
  declarations: [ItemDetail],
  exports: [ItemDetail],
})
export class ItemDetailModule {
}
