import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Dashboard} from '@crafted/components';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../../store';
import {RemoveDashboard, UpdateDashboard} from '../../../store/dashboard/dashboard.action';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation';
import {DashboardEdit, QueryEditData} from './dashboard-edit/dashboard-edit';

@Injectable()
export class DashboardDialog {
  constructor(
    private dialog: MatDialog, private snackbar: MatSnackBar, private store: Store<AppState>) {
  }

  editDashboard(dashboard: Dashboard) {
    const dialogRef = this.dialog.open(DashboardEdit, {
      data: {
        name: dashboard.name,
        description: dashboard.description,
      }
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult: QueryEditData) => {
        if (dialogResult) {
          this.store.dispatch(new UpdateDashboard({update: {
              id: dashboard.id,
              changes: {
                name: dialogResult.name,
                description: dialogResult.description,
              }
            }}));
        }
      });
  }

  /**
   * Shows delete query dialog. If user confirms deletion, remove the
   * query and navigate to the queries page.
   */
  removeDashboard(dashboard: Dashboard) {
    const dialogRef = this.dialog.open(DeleteConfirmation, {data: {name: of(dashboard.name)}});
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(dialogResult => {
        if (dialogResult) {
          this.store.dispatch(new RemoveDashboard({id: dashboard.id}));

          // TODO: Make an effect for this
          this.snackbar.open(`Dashboard "${dashboard.name}" deleted`, '', {duration: 2000});
        }
      });
  }
}
