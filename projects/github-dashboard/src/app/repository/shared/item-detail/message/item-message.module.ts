import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TimeAgoPipeModule} from 'projects/github-dashboard/src/app/app.module';
import {ItemMessage} from './item-message';

@NgModule({
  imports: [CommonModule, TimeAgoPipeModule],
  declarations: [ItemMessage],
  exports: [ItemMessage],
})
export class ItemMessageModule {
}
