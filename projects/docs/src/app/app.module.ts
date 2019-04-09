import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AdvancedSearchModule, EditableChipListModule, ItemSummaryModule} from '@crafted/components';
import {AppComponent} from './app.component';
import {DemoAdvancedSearch} from './demo-advanced-search/demo-advanced-search';
import {DemoItemsSummary} from './demo-items-summary/demo-items-summary';

@NgModule({
  declarations: [AppComponent, DemoItemsSummary, DemoAdvancedSearch],
  imports: [
    ItemSummaryModule,
    AdvancedSearchModule,
    EditableChipListModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: 'demo-items-summary', component: DemoItemsSummary},
      {path: 'demo-advanced-search', component: DemoAdvancedSearch},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
