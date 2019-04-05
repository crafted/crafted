import {TextFieldModule} from '@angular/cdk/text-field';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {
  AdvancedSearchModule
} from '../../../package/component/advanced-search/advanced-search.module';
import {
  EditableChipListModule
} from '../../../package/component/editable-chip-list/editable-chip-list.module';
import {
  DeleteConfirmationModule
} from '../../shared/dialog/delete-confirmation/delete-confirmation.module';
import {EditableRecommendation} from './editable-recommendation';


@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    TextFieldModule,
    ReactiveFormsModule,
    DeleteConfirmationModule,
    AdvancedSearchModule,
    EditableChipListModule,
  ],
  declarations: [EditableRecommendation],
  exports: [EditableRecommendation],
})
export class EditableRecommendationModule {
}
