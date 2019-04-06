import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Dashboard} from '@crafted/components';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {ActiveStore} from '../../../services/active-store';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation';
import {DashboardEdit} from './dashboard-edit/dashboard-edit';

@Injectable()
export class DashboardDialog {
  constructor(
      private dialog: MatDialog, private snackbar: MatSnackBar, private activeRepo: ActiveStore) {}

  editDashboard(dashboard: Dashboard) {
    const data = {
      name: dashboard.name,
      description: dashboard.description,
    };

    const store = this.activeRepo.activeConfig;
    this.dialog.open(DashboardEdit, {data}).afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        store.dashboards.update({id: dashboard.id, ...result});
      }
    });
  }

  /**
   * Shows delete query dialog. If user confirms deletion, remove the
   * query and navigate to the queries page.
   */
  removeDashboard(dashboard: Dashboard) {
    const data = {name: of(dashboard.name)};
    const store = this.activeRepo.activeConfig;

    this.dialog.open(DeleteConfirmation, {data})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            store.dashboards.remove(dashboard.id!);
            this.snackbar.open(`Dashboard "${dashboard.name}" deleted`, '', {duration: 2000});
          }
        });
  }
}
