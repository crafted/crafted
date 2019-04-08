import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditableChipListModule, ItemSummaryModule} from '@crafted/components';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ItemSummaryModule,
    EditableChipListModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
