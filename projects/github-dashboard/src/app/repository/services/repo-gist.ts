import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Dashboard} from 'projects/github-dashboard/src/app/components';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {map, mergeMap, take, tap} from 'rxjs/operators';

import {Config, RepoConfig} from '../../service/config';
import {Query} from '../model/query';
import {Recommendation} from '../model/recommendation';
import {ConfirmConfigUpdates} from '../shared/dialog/confirm-config-updates/confirm-config-updates';
import {AppState} from '../store';
import {SyncDashboards} from '../store/dashboard/dashboard.action';
import {selectDashboards} from '../store/dashboard/dashboard.reducer';
import {SyncQueries} from '../store/query/query.action';
import {selectQueryList} from '../store/query/query.reducer';
import {SyncRecommendations} from '../store/recommendation/recommendation.action';
import {selectRecommendations} from '../store/recommendation/recommendation.reducer';
import {
  compareLocalToRemote,
  IdentifiedObject,
  LocalToRemoteComparison
} from '../utility/compare-local-to-remote';

@Injectable()
export class RepoGist {
  private destroyed = new Subject();

  constructor(private config: Config, private dialog: MatDialog, private store: Store<AppState>) {}

  sync(repository: string): Observable<void> {
    let syncResults: LocalToRemoteComparison<IdentifiedObject>[]|null;
    return this.config.getRepoConfig(repository)
        .pipe(
            mergeMap(repoConfig => getSyncResults(repoConfig, this.store)),
            tap(results => syncResults = results), mergeMap(results => this.confirmSync(results)),
            map(confirmed => {
              if (!confirmed) {
                // TODO: Perhaps update the modified date on the update items to make sure
                // the local versions now have a later modified date for next time the comparison
                // is made.
                return;
              }

              // TODO: This should just be part of the payload
              const dashboardsSync = syncResults[0] as LocalToRemoteComparison<Dashboard>;
              const addDashboards = dashboardsSync.toAdd.map(d => ({id: d.id, changes: {...d}}));
              const updateDashboards =
                  dashboardsSync.toUpdate.map(d => ({id: d.id, changes: {...d}}));
              this.store.dispatch(new SyncDashboards({
                update: updateDashboards.concat(addDashboards),
                remove: dashboardsSync.toRemove.map(d => d.id),
              }));

              const queriesSync = syncResults[0] as LocalToRemoteComparison<Query>;
              const addQueries = queriesSync.toAdd.map(q => ({id: q.id, changes: {...q}}));
              const updateQueries = queriesSync.toUpdate.map(q => ({id: q.id, changes: {...q}}));
              this.store.dispatch(new SyncQueries({
                update: updateQueries.concat(addQueries),
                remove: queriesSync.toRemove.map(q => q.id),
              }));

              const recommendationsSync = syncResults[0] as LocalToRemoteComparison<Recommendation>;
              const addRecommendations =
                  recommendationsSync.toAdd.map(r => ({id: r.id, changes: {...r}}));
              const updateRecommendations =
                  recommendationsSync.toUpdate.map(r => ({id: r.id, changes: {...r}}));
              this.store.dispatch(new SyncRecommendations({
                update: updateRecommendations.concat(addRecommendations),
                remove: recommendationsSync.toRemove.map(r => r.id),
              }));
            }));
  }

  private confirmSync(syncResults: LocalToRemoteComparison<any>[]|null): Observable<boolean> {
    if (!syncResults || syncResults.every(result => !hasSyncChanges(result))) {
      return of(false);
    }

    const data = {
      dashboards: syncResults[0],
      queries: syncResults[1],
      recommendations: syncResults[2],
    };
    return this.dialog.open(ConfirmConfigUpdates, {width: '400px', data})
        .afterClosed()
        .pipe(take(1));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

function hasSyncChanges(syncResponse: LocalToRemoteComparison<any>): boolean {
  return syncResponse &&
      (!!syncResponse.toAdd.length || !!syncResponse.toRemove.length ||
       !!syncResponse.toUpdate.length);
}

/** Gets the comparison results between the local store and remote config */
function getSyncResults(remoteConfig: RepoConfig|null, store: Store<AppState>):
    Observable<LocalToRemoteComparison<any>[]|null> {
  if (!remoteConfig) {
    return of(null);
  }

  return combineLatest(
             store.select(selectDashboards), store.select(selectQueryList),
             store.select(selectRecommendations))
      .pipe(
          map(([dashboards, queries, recommendations]) =>
                  [compareLocalToRemote(dashboards, remoteConfig.dashboards),
                   compareLocalToRemote(queries, remoteConfig.queries),
                   compareLocalToRemote(recommendations, remoteConfig.recommendations)]),
          take(1));
}
