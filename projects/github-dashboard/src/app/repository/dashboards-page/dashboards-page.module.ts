import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {RouterModule, Routes} from '@angular/router';
import {CollectionPageEmptyStateModule} from '../shared/collection-page-empty-state/collection-page-empty-state.module';
import {DashboardDialogModule} from '../shared/dialog/dashboard/dashboard-dialog.module';
import {HeaderContentModule} from '../shared/header-content/header-content.module';
import {DashboardsPage} from './dashboards-page';


const routes: Routes = [{path: '', component: DashboardsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class DashboardsPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    DashboardsPageRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DashboardDialogModule,
    HeaderContentModule,
    CollectionPageEmptyStateModule,
  ],
  declarations: [DashboardsPage],
  exports: [DashboardsPage],
})
export class DashboardsPageModule {
}
