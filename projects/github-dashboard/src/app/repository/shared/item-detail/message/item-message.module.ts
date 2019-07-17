import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ItemMessage} from './item-message';

@NgModule({
  imports: [CommonModule],
  declarations: [ItemMessage],
  exports: [ItemMessage],
})
export class ItemMessageModule {
}
