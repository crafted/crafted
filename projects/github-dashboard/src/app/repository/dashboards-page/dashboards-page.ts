import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Column, Dashboard} from '@crafted/components';
import {Observable} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {ActiveStore} from '../services/active-store';
import {Header} from '../services/header';
import {PageNavigator} from '../services/page-navigator';
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
  dashboards$ = this.activeStore.state.pipe(mergeMap(store => store.dashboardsDao.list));

  headerActions: Observable<HeaderContentAction[]> =
    this.dashboards$.pipe(map(dashboards => dashboards.length ? HEADER_ACTIONS : []));

  constructor(
    private header: Header, private router: Router, public dashboardDialog: DashboardDialog,
    private activeStore: ActiveStore, private pageNavigator: PageNavigator) {
  }

  trackById = (_i: number, dashboard: Dashboard) => dashboard.id;

  create() {
    const columns: Column[] = [{widgets: []}, {widgets: []}, {widgets: []}];
    const newDashboard: Dashboard = {name: 'New Dashboard', columnGroups: [{columns}]};

    this.activeStore.state
      .pipe(mergeMap(repoState => repoState.dashboardsDao.add(newDashboard)), take(1))
      .subscribe(id => this.navigateToDashboard(id));
  }

  navigateToDashboard(id: string) {
    this.pageNavigator.navigateToDashboard(id);
  }

  handleHeaderAction(action: DashboardsPageAction) {
    if (action === 'create') {
      this.create();
    }
  }
}
