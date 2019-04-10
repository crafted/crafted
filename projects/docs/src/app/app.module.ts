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
import {AppComponent} from './app.component';
import {DemoAdvancedSearch} from './demo-advanced-search/demo-advanced-search';
import {DemoDisplayOptions} from './demo-display-options/demo-display-options';
import {DemoItemsSummary} from './demo-items-summary/demo-items-summary';

@NgModule({
  declarations: [AppComponent, DemoItemsSummary, DemoAdvancedSearch, DemoDisplayOptions],
  imports: [
    ItemSummaryModule,
    MatDividerModule,
    AdvancedSearchModule,
    EditableChipListModule,
    DisplayOptionsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'demo-items-summary', component: DemoItemsSummary},
      {path: 'demo-advanced-search', component: DemoAdvancedSearch},
      {path: 'demo-display-options', component: DemoDisplayOptions},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
