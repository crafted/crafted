import {CdkPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActiveStore} from '../services/active-store';
import {Header} from '../services/header';
import {DashboardDialog} from '../shared/dialog/dashboard/dashboard-dialog';
import {Dashboard} from '../../package/component/dashboard/dashboard';


@Component({
  selector: 'dashboards-page',
  styleUrls: ['dashboards-page.scss'],
  templateUrl: 'dashboards-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardsPage {
  trackById = (_i: number, dashboard: Dashboard) => dashboard.id;

  list = this.activeRepo.activeConfig.dashboards.list;

  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  constructor(
      private header: Header, private router: Router, public dashboardDialog: DashboardDialog,
      private activeRepo: ActiveStore) {}

  ngOnInit() {
    this.list.pipe(takeUntil(this.destroyed)).subscribe(list => {
      if (list.length) {
        this.header.toolbarOutlet.next(this.toolbarActions);
      } else {
        this.header.toolbarOutlet.next(null);
      }
    });
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
    this.destroyed.next();
    this.destroyed.complete();
  }

  createDashboard() {
    this.router.navigate([`${this.activeRepo.activeName}/dashboard/new`]);
  }

  navigateToDashboard(id: string) {
    this.router.navigate([`${this.activeRepo.activeName}/dashboard/${id}`]);
  }
}
