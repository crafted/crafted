import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {PieChartModule, TimeSeriesModule} from '@crafted/chartjs-widgets';
import {CountModule, DashboardViewModule, ListModule} from '@crafted/components';
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
