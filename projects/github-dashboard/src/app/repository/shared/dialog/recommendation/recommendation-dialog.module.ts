import {NgModule} from '@angular/core';
import {MatDialogModule, MatSnackBarModule} from '@angular/material';
import {DeleteConfirmationModule} from '../delete-confirmation/delete-confirmation.module';
import {RecommendationDialog} from './recommendation-dialog';
import {RecommendationEditModule} from './recommendation-edit/recommendation-edit.module';

@NgModule({
  imports: [
    MatSnackBarModule,
    MatDialogModule,
    DeleteConfirmationModule,
    RecommendationEditModule,
  ],
  providers: [RecommendationDialog]
})
export class RecommendationDialogModule {
}
