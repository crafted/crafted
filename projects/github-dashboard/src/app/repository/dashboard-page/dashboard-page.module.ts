import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {DashboardViewModule} from '../../package/component/dashboard/dashboard-view.module';
import {CountModule} from '../../package/component/widget/widget-view/count/count.module';
import {ListModule} from '../../package/component/widget/widget-view/list/list.module';
import {
  PieChartModule
} from '../../package/component/widget/widget-view/pie-chart/pie-chart.module';
import {
  TimeSeriesModule
} from '../../package/component/widget/widget-view/time-series/time-series.module';
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
