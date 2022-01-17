import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ItemRenderedView} from './rendered-view';

@NgModule({
  imports: [CommonModule],
  declarations: [ItemRenderedView],
  exports: [ItemRenderedView],
})
export class RenderedViewModule {
}
