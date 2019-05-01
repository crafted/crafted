import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Column, Dashboard} from '@crafted/components';
import {Observable} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
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
  dashboards$ = this.activeStore.config.pipe(mergeMap(store => store.dashboards.list));

  constructor(
    private header: Header, private router: Router, public dashboardDialog: DashboardDialog,
    private activeStore: ActiveStore) {
  }

  headerActions: Observable<HeaderContentAction[]> =
    this.dashboards$.pipe(map(dashboards => dashboards.length ? HEADER_ACTIONS : []));

  trackById = (_i: number, dashboard: Dashboard) => dashboard.id;

  create() {
    const columns: Column[] = [{widgets: []}, {widgets: []}, {widgets: []}];
    const newDashboard: Dashboard = {name: 'New Dashboard', columnGroups: [{columns}]};
    this.activeStore.activeConfig.dashboards.add(newDashboard).pipe(take(1)).subscribe(id => {
      this.router.navigate([`${this.activeStore.activeName}/dashboard/${id}`]);
    });
  }

  navigateToDashboard(id: string) {
    this.router.navigate([`${this.activeStore.activeName}/dashboard/${id}`]);
  }

  handleHeaderAction(action: DashboardsPageAction) {
    if (action === 'create') {
      this.create();
    }
  }
}
