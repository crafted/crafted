import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ItemSummaryModule} from '@crafted/components';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ItemSummaryModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
