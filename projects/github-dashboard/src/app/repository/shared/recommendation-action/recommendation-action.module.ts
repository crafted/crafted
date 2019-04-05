import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material';
import {LabelListModule} from '../label-list/label-list.module';
import {RecommendationAction} from './recommendation-action';

@NgModule({
  imports: [CommonModule, MatIconModule, LabelListModule],
  declarations: [RecommendationAction],
  exports: [RecommendationAction],
})
export class RecommendationActionModule {
}
