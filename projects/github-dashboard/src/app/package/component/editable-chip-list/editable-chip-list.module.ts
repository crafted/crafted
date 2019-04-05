import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
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
