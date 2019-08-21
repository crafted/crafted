import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {ItemMessage} from './item-message';

@NgModule({
  imports: [CommonModule, MatProgressBarModule],
  declarations: [ItemMessage],
  exports: [ItemMessage],
})
export class ItemMessageModule {
}
