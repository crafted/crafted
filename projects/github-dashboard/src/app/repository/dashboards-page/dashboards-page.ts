import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Column, Dashboard} from '@crafted/components';
import {Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {ActiveStore} from '../services/active-store';
import {Header} from '../services/header';
import {DashboardDialog} from '../shared/dialog/dashboard/dashboard-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';

type DashboardsPageAction = 'editJson' | 'create';

const HEADER_ACTIONS: HeaderContentAction<DashboardsPageAction>[] = [
  {
    id: 'create',
    isPrimary: true,
    text: 'Create New Dashboard',
  },
];

@Component({
  selector: 'dashboards-page',
  styleUrls: ['dashboards-page.scss'],
  templateUrl: 'dashboards-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardsPage {
  constructor(
      private header: Header, private router: Router, public dashboardDialog: DashboardDialog,
      private activeRepo: ActiveStore) {}

  dashboards$ = this.activeRepo.config.pipe(mergeMap(store => store.dashboards.list));

  headerActions: Observable<HeaderContentAction[]> =
    this.dashboards$.pipe(map(dashboards => dashboards.length ? HEADER_ACTIONS : []));

  trackById = (_i: number, dashboard: Dashboard) => dashboard.id;

  create() {
    const columns: Column[] = [{widgets: []}, {widgets: []}, {widgets: []}];
    const newDashboard: Dashboard = {name: 'New Dashboard', columnGroups: [{columns}]};
    const id = this.activeRepo.activeConfig.dashboards.add(newDashboard);
    this.router.navigate([`${this.activeRepo.activeName}/dashboard/${id}`]);
  }

  navigateToDashboard(id: string) {
    this.router.navigate([`${this.activeRepo.activeName}/dashboard/${id}`]);
  }

  handleHeaderAction(action: DashboardsPageAction) {
    if (action === 'create') {
      this.create();
    }
  }
}
