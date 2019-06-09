import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {createId} from '../../../utility/create-id';
import {StoreId} from '../../utility/app-indexed-db';
import {AppState} from '../index';
import {RemoveLocalDbEntities, UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {selectRepositoryName} from '../repository/repository.reducer';
import {
  CreateDashboard,
  DashboardActionTypes,
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
      withLatestFrom(this.store.select(selectDashboardEntities)),
      map(([action, dashboards]) => {
        const dashboard = {
          ...dashboards[action.payload.update.id],
          ...action.payload.update.changes,
        };

        return new UpsertDashboards({dashboards: [dashboard]});
      }));

  @Effect()
  persistUpsert = this.actions.pipe(
      ofType<UpsertDashboards>(DashboardActionTypes.UPSERT_DASHBOARDS), map(action => {
        const updatePayload = {entities: action.payload.dashboards, type: 'dashboards' as StoreId};
        return new UpdateLocalDbEntities(updatePayload);
      }));

  @Effect()
  persistRemove = this.actions.pipe(
      ofType<RemoveDashboard>(DashboardActionTypes.REMOVE),
      map(action => new RemoveLocalDbEntities(
              {ids: [action.payload.id], type: 'dashboards' as StoreId})));

  @Effect()
  sync =
      this.actions.pipe(ofType<SyncDashboards>(DashboardActionTypes.SYNC), switchMap(action => {
                          const removeAction = new RemoveLocalDbEntities(
                              {ids: [action.payload.remove], type: 'dashboards' as StoreId});
                          const updateAction = new UpdateLocalDbEntities(
                              {entities: [action.payload.update], type: 'dashboards' as StoreId});
                          return [removeAction, updateAction];
                        }));

  constructor(private actions: Actions, private store: Store<AppState>, private router: Router) {}
}
