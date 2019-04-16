import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {RecommendationView} from './recommendation-view';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ReactiveFormsModule,
  ],
  declarations: [RecommendationView],
  exports: [RecommendationView],
})
export class RecommendationViewModule {
}
