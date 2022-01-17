import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {EditableChipList} from './editable-chip-list';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  declarations: [EditableChipList],
  exports: [EditableChipList]
})
export class EditableChipListModule {
}
