import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  EditableChipListModule,
  FilterStateOptionModule,
  FormFieldModule
} from 'projects/github-dashboard/src/app/components';
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
    FormFieldModule,
    MatButtonToggleModule,
    FilterStateOptionModule,
  ],
  declarations: [RecommendationEdit],
  exports: [RecommendationEdit],
  entryComponents: [RecommendationEdit]
})
export class RecommendationEditModule {
}
