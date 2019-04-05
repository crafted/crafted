import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {LoadingModule} from '../shared/loading/loading.module';
import {
  EditableRecommendationModule
} from './editable-recommendation/editable-recommendation.module';
import {RecommendationsPage} from './recommendations-page';

const routes: Routes = [{path: '', component: RecommendationsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class RecommendationsPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    PortalModule,
    LoadingModule,
    ReactiveFormsModule,
    EditableRecommendationModule,
    RecommendationsPageRoutingModule,
  ],
  declarations: [RecommendationsPage],
  exports: [RecommendationsPage],
})
export class RecommendationsPageModule {
}
