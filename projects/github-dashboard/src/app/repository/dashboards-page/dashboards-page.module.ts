import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {DashboardDialogModule} from '../shared/dialog/dashboard/dashboard-dialog.module';
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
    PortalModule,
    DashboardDialogModule,
  ],
  declarations: [DashboardsPage],
  exports: [DashboardsPage],
})
export class DashboardsPageModule {
}
