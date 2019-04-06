import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {
  CountModule,
  DashboardViewModule,
  ListModule,
  PieChartModule,
  TimeSeriesModule
} from '@crafted/components';
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
    PortalModule,
    ReactiveFormsModule,
    DashboardViewModule,
    DashboardPageRoutingModule,
    PieChartModule,
    ListModule,
    CountModule,
    TimeSeriesModule,
  ],
  declarations: [DashboardPage],
  exports: [DashboardPage],
})
export class DashboardPageModule {
}
