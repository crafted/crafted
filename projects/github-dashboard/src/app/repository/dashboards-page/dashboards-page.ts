import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Dashboard} from '@crafted/components';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Header} from '../services/header';
import {DashboardDialog} from '../shared/dialog/dashboard/dashboard-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';
import {AppState} from '../store';
import {CreateDashboard, NavigateToDashboard} from '../store/dashboard/dashboard.action';
import {selectDashboards} from '../store/dashboard/dashboard.reducer';

type DashboardsPageAction = 'editJson'|'create';

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
  dashboards$ = this.store.select(selectDashboards);

  headerActions: Observable<HeaderContentAction[]> =
      this.dashboards$.pipe(map(dashboards => dashboards.length ? HEADER_ACTIONS : []));

  constructor(
      private header: Header, private router: Router, public dashboardDialog: DashboardDialog,
      private store: Store<AppState>) {}

  trackById = (_i: number, dashboard: Dashboard) => dashboard.id;

  create() {
    this.store.dispatch(new CreateDashboard());
  }

  navigateToDashboard(id: string) {
    this.store.dispatch(new NavigateToDashboard({id}));
  }

  handleHeaderAction(action: DashboardsPageAction) {
    if (action === 'create') {
      this.create();
    }
  }
}
