import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {AdvancedSearchModule} from '@crafted/components';
import {CollectionPageEmptyStateModule} from '../../shared/collection-page-empty-state/collection-page-empty-state.module';
import {RecommendationDialogModule} from '../../shared/dialog/recommendation/recommendation-dialog.module';
import {HeaderContentModule} from '../../shared/header-content/header-content.module';
import {LoadingModule} from '../../shared/loading/loading.module';
import {RecommendationViewModule} from './recommendation-view/recommendation-view.module';
import {RecommendationsPage} from './recommendations-page';

const routes: Routes = [{path: '', component: RecommendationsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class RecommendationsPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    HeaderContentModule,
    LoadingModule,
    ReactiveFormsModule,
    CollectionPageEmptyStateModule,
    RecommendationsPageRoutingModule,
    RecommendationDialogModule,
    RecommendationViewModule,
    AdvancedSearchModule,
  ],
  declarations: [RecommendationsPage],
  exports: [RecommendationsPage],
})
export class RecommendationsPageModule {
}
