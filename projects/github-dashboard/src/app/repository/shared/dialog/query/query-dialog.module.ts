import {NgModule} from '@angular/core';
import {MatSnackBarModule, MatDialogModule} from '@angular/material';
import {DeleteConfirmationModule} from '../delete-confirmation/delete-confirmation.module';
import {QueryDialog} from './query-dialog';
import {QueryEditModule} from './query-edit/query-edit.module';


@NgModule({
  imports: [
    MatSnackBarModule,
    MatDialogModule,
    DeleteConfirmationModule,
    QueryEditModule,
  ],
  providers: [QueryDialog]
})
export class QueryDialogModule {
}
