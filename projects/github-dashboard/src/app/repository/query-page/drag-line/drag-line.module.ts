import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgModule} from '@angular/core';
import {DragLine} from './drag-line';


@NgModule({
  imports: [DragDropModule],
  declarations: [DragLine],
  exports: [DragLine],
})
export class DragLineModule {
}
