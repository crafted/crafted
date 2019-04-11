import {NgModule} from '@angular/core';
import {MatDividerModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {
  AdvancedSearchModule,
  CountModule,
  DashboardViewModule,
  DisplayOptionsModule,
  EditableChipListModule,
  ItemsListModule,
  ItemSummaryModule,
  ListModule,
  PieChartModule,
  TimeSeriesModule
} from '@crafted/components';
import {AppComponent} from './app.component';
import {DemoAdvancedSearch} from './demo-advanced-search/demo-advanced-search';
import {BarChart} from './demo-dashboard/bar-chart/bar-chart';
import {EditBarChart} from './demo-dashboard/bar-chart/edit-bar-chart';
import {DemoDashboard} from './demo-dashboard/demo-dashboard';
import {DemoDisplayOptions} from './demo-display-options/demo-display-options';
import {DemoItemsList} from './demo-items-list/demo-items-list';
import {DemoItemsSummary} from './demo-items-summary/demo-items-summary';

@NgModule({
  declarations: [
    AppComponent,
    DemoItemsSummary,
    DemoAdvancedSearch,
    DemoDisplayOptions,
    DemoItemsList,
    DemoDashboard,
    BarChart,
    EditBarChart,
  ],
  imports: [
    ItemSummaryModule,
    ItemsListModule,
    MatDividerModule,
    AdvancedSearchModule,
    EditableChipListModule,
    DashboardViewModule,
    DisplayOptionsModule,
    BrowserAnimationsModule,
    PieChartModule,
    ListModule,
    CountModule,
    TimeSeriesModule,
    RouterModule.forRoot([
      {path: 'demo-items-summary', component: DemoItemsSummary},
      {path: 'demo-advanced-search', component: DemoAdvancedSearch},
      {path: 'demo-display-options', component: DemoDisplayOptions},
      {path: 'demo-items-list', component: DemoItemsList},
      {path: 'demo-dashboard', component: DemoDashboard},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    BarChart,
    EditBarChart,
  ]
})
export class AppModule {
}
