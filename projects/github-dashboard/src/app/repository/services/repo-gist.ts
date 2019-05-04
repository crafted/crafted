import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Dashboard} from '@crafted/components';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {map, mergeMap, take, tap} from 'rxjs/operators';
import {Config, RepoConfig} from '../../service/config';
import {ConfirmConfigUpdates} from '../shared/dialog/confirm-config-updates/confirm-config-updates';
import {RepoState} from './active-store';
import {Query} from './dao/config/query';
import {Recommendation} from './dao/config/recommendation';
import {compareLocalToRemote, IdentifiedObject, LocalToRemoteComparison} from './dao/list-dao';

@Injectable()
export class RepoGist {
  private destroyed = new Subject();

  constructor(private config: Config, private dialog: MatDialog) {}

  sync(repository: string, state: RepoState): Observable<void> {
    let syncResults: LocalToRemoteComparison<IdentifiedObject>[]|null;
    return this.config.getRepoConfig(repository)
        .pipe(
          mergeMap(repoConfig => getSyncResults(state, repoConfig)),
            tap(results => syncResults = results), mergeMap(results => this.confirmSync(results)),
            map(confirmed => {
              if (!confirmed) {
                // TODO: Perhaps update the modified date on the update items to make sure
                // the local versions now have a later modified date for next time the comparison
                // is made.
                return;
              }

              const dashboardsSync = syncResults[0] as LocalToRemoteComparison<Dashboard>;
              state.dashboardsDao.add(dashboardsSync.toAdd);
              state.dashboardsDao.update(dashboardsSync.toUpdate);
              state.dashboardsDao.remove(dashboardsSync.toRemove.map(v => v.id));

              const querySync = syncResults[1] as LocalToRemoteComparison<Query>;
              state.queriesDao.add(querySync.toAdd);
              state.queriesDao.update(querySync.toUpdate);
              state.queriesDao.remove(querySync.toRemove.map(v => v.id));

              const recommendationsSync =
                syncResults[2] as LocalToRemoteComparison<Recommendation>;
              state.recommendationsDao.add(recommendationsSync.toAdd);
              state.recommendationsDao.update(recommendationsSync.toUpdate);
              state.recommendationsDao.remove(recommendationsSync.toRemove.map(v => v.id));
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
function getSyncResults(state: RepoState, remoteConfig: RepoConfig | null):
    Observable<LocalToRemoteComparison<any>[]|null> {
  if (!remoteConfig) {
    return of(null);
  }

  return combineLatest(state.dashboardsDao.list, state.queriesDao.list, state.recommendationsDao.list)
      .pipe(
          map(results =>
            [compareLocalToRemote(results[0], remoteConfig.dashboards),
              compareLocalToRemote(results[1], remoteConfig.queries),
              compareLocalToRemote(results[2], remoteConfig.recommendations)]),
          take(1));
}
