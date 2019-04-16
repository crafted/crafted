import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {
  RecommendationDialogModule
} from '../shared/dialog/recommendation/recommendation-dialog.module';
import {LoadingModule} from '../shared/loading/loading.module';
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
    MatMenuModule,
    PortalModule,
    LoadingModule,
    ReactiveFormsModule,
    RecommendationsPageRoutingModule,
    RecommendationDialogModule,
  ],
  declarations: [RecommendationsPage],
  exports: [RecommendationsPage],
})
export class RecommendationsPageModule {
}
