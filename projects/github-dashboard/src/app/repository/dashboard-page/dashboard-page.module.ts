import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule, Routes} from '@angular/router';
import {PieChartModule, TimeSeriesModule} from 'projects/github-dashboard/src/app/chartjs-widgets';
import {CountModule, DashboardViewModule, ListModule} from 'projects/github-dashboard/src/app/components';
import {ItemDetailDialogModule} from '../shared/dialog/item-detail-dialog/item-detail-dialog.module';
import {HeaderContentModule} from '../shared/header-content/header-content.module';
import {DashboardPage} from './dashboard-page';

const routes: Routes = [{
  path: '',
  component: DashboardPage,
}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class DashboardPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DashboardViewModule,
    DashboardPageRoutingModule,
    PieChartModule,
    ListModule,
    HeaderContentModule,
    CountModule,
    TimeSeriesModule,
    ItemDetailDialogModule,
  ],
  declarations: [DashboardPage],
  exports: [DashboardPage],
})
export class DashboardPageModule {
}
