import {NgModule} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {DeleteConfirmationModule} from '../delete-confirmation/delete-confirmation.module';
import {DashboardDialog} from './dashboard-dialog';
import {DashboardEditModule} from './dashboard-edit/dashboard-edit.module';


@NgModule({
  imports: [
    DeleteConfirmationModule,
    DashboardEditModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [DashboardDialog]
})
export class DashboardDialogModule {
}
