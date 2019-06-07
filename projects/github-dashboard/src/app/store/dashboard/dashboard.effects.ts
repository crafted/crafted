import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {StoreId} from '../../repository/utility/app-indexed-db';
import {createId} from '../../utility/create-id';
import {AppState} from '../index';
import {RemoveLocalDbEntities, UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {
  CreateDashboard,
  DashboardActionTypes,
  NavigateToDashboard,
  RemoveDashboard,
  SyncDashboards,
  UpdateDashboard,
  UpsertDashboards
} from './dashboard.action';

@Injectable()
export class DashboardEffects {
  @Effect()
  createNewDashboard = this.actions.pipe(
      ofType<CreateDashboard>(DashboardActionTypes.CREATE_DASHBOARD), switchMap(() => {
        const newDashboard = {
          id: createId(),
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
      withLatestFrom(this.store),
      tap(([action, state]) =>
              this.router.navigate([`${state.repository.name}/dashboard/${action.payload.id}`])));

  @Effect()
  update = this.actions.pipe(
      ofType<UpdateDashboard>(DashboardActionTypes.UPDATE_DASHBOARD),
      withLatestFrom(this.store.select(state => state.dashboards.entities)),
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
