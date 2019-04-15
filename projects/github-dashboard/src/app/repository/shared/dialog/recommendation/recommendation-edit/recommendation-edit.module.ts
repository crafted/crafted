import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import {
  ButtonToggleGroupOptionModule,
  EditableChipListModule,
  FilterStateOptionModule,
  InputOptionModule
} from '@crafted/components';
import {RecommendationEdit} from './recommendation-edit';

@NgModule({
  imports: [
    CommonModule,
    EditableChipListModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    InputOptionModule,
    ButtonToggleGroupOptionModule,
    FilterStateOptionModule,
  ],
  declarations: [RecommendationEdit],
  exports: [RecommendationEdit],
  entryComponents: [RecommendationEdit]
})
export class RecommendationEditModule {
}
