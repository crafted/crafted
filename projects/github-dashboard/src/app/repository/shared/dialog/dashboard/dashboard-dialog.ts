import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Dashboard} from '@crafted/components';
import {combineLatest, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {ActiveStore} from '../../../services/active-store';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation';
import {DashboardEdit} from './dashboard-edit/dashboard-edit';

@Injectable()
export class DashboardDialog {
  constructor(
    private dialog: MatDialog, private snackbar: MatSnackBar, private activeStore: ActiveStore) {
  }

  editDashboard(dashboard: Dashboard) {
    const dialogRef = this.dialog.open(DashboardEdit, {
      data: {
        name: dashboard.name,
        description: dashboard.description,
      }
    });
    combineLatest(this.activeStore.state, dialogRef.afterClosed())
      .pipe(take(1))
      .subscribe(([repoState, dialogResult]) => {
        if (dialogResult) {
          repoState.dashboardsDao.update({id: dashboard.id, ...dialogResult});
        }
      });
  }

  /**
   * Shows delete query dialog. If user confirms deletion, remove the
   * query and navigate to the queries page.
   */
  removeDashboard(dashboard: Dashboard) {
    const dialogRef = this.dialog.open(DeleteConfirmation, {data: {name: of(dashboard.name)}});
    combineLatest(this.activeStore.state, dialogRef.afterClosed())
      .pipe(take(1))
      .subscribe(([repoState, dialogResult]) => {
        if (dialogResult) {
          repoState.dashboardsDao.remove(dashboard.id);
          this.snackbar.open(`Dashboard "${dashboard.name}" deleted`, '', {duration: 2000});
        }
      });
  }
}
