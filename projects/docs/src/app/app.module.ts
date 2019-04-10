import {NgModule} from '@angular/core';
import {MatDividerModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {
  AdvancedSearchModule,
  DisplayOptionsModule,
  EditableChipListModule,
  ItemSummaryModule
} from '@crafted/components';
import {ItemsListModule} from 'projects/components/src/public-api';
import {AppComponent} from './app.component';
import {DemoAdvancedSearch} from './demo-advanced-search/demo-advanced-search';
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
  ],
  imports: [
    ItemSummaryModule,
    ItemsListModule,
    MatDividerModule,
    AdvancedSearchModule,
    EditableChipListModule,
    DisplayOptionsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'demo-items-summary', component: DemoItemsSummary},
      {path: 'demo-advanced-search', component: DemoAdvancedSearch},
      {path: 'demo-display-options', component: DemoDisplayOptions},
      {path: 'demo-items-list', component: DemoItemsList},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
