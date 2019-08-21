import {NgModule} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
