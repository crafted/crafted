import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';

import {RepositoryDatabase} from '../../../service/repository-database';
import {createId} from '../../../utility/create-id';
import {AppState} from '../index';
import {ItemActionTypes} from '../item/item.action';
import {selectRepositoryName} from '../repository/repository.reducer';

import {
  CreateDashboard,
  DashboardActionTypes,
  LoadDashboards,
  LoadDashboardsComplete,
  NavigateToDashboard,
  RemoveDashboard,
  SyncDashboards,
  UpdateDashboard,
  UpsertDashboards
} from './dashboard.action';
import {selectDashboardEntities} from './dashboard.reducer';

@Injectable()
export class DashboardEffects {
  @Effect()
  load = this.actions.pipe(
    ofType<LoadDashboards>(ItemActionTypes.LOAD), switchMap(action => {
      return this.repositoryDatabase.getValues(action.payload.repository)
        .dashboards.pipe(
          take(1),
          map(dashboards => new LoadDashboardsComplete({dashboards})));
    }));

  @Effect()
  createNewDashboard = this.actions.pipe(
      ofType<CreateDashboard>(DashboardActionTypes.CREATE_DASHBOARD), switchMap(() => {
        const newDashboard = {
          id: createId(),
          dbAdded: new Date().toISOString(),
          name: 'New Dashboard',
          columnGroups: [
            {columns: [{widgets: []}, {widgets: []}, {widgets: []}]},
          ]
        };

        return [
          new UpsertDashboards({dashboards: [newDashboard]}),
          new NavigateToDashboard({id: newDashboard.id})
        ];
      }));

  @Effect({dispatch: false})
  navigateToDashboard = this.actions.pipe(
      ofType<NavigateToDashboard>(DashboardActionTypes.NAVIGATE_TO_DASHBOARD),
      withLatestFrom(this.store.select(selectRepositoryName)),
      tap(([action, repositoryName]) =>
              this.router.navigate([`${repositoryName}/dashboard/${action.payload.id}`])));

  @Effect()
  update = this.actions.pipe(
      ofType<UpdateDashboard>(DashboardActionTypes.UPDATE_DASHBOARD),
      withLatestFrom(this.store.select(selectDashboardEntities)), map(([action, dashboards]) => {
        const dashboard = {
          ...dashboards[action.payload.update.id],
          ...action.payload.update.changes,
        };

        return new UpsertDashboards({dashboards: [dashboard]});
      }));

  @Effect({dispatch: false})
  persistUpsert = this.actions.pipe(
      ofType<UpsertDashboards>(DashboardActionTypes.UPSERT_DASHBOARDS),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'dashboards', action.payload.dashboards);
      }));

  @Effect({dispatch: false})
  persistRemove = this.actions.pipe(
      ofType<RemoveDashboard>(DashboardActionTypes.REMOVE),
      withLatestFrom(this.store.select(selectRepositoryName)),
      tap(([action, repository]) =>
              this.repositoryDatabase.remove(repository, 'dashboards', [action.payload.id])));

  @Effect({dispatch: false})
  sync = this.actions.pipe(
      ofType<SyncDashboards>(DashboardActionTypes.SYNC),
      withLatestFrom(this.store.select(selectRepositoryName)),

      tap(([action, repository]) => {
        if (action.payload.remove.length) {
          this.repositoryDatabase.remove(repository, 'dashboards', action.payload.remove);
        }

        if (action.payload.update.length) {
          this.repositoryDatabase.update(repository, 'dashboards', action.payload.update);
        }
      }));

  constructor(
      private actions: Actions, private store: Store<AppState>, private router: Router,
      private repositoryDatabase: RepositoryDatabase) {}
}
