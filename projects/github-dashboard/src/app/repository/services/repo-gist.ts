import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {map, mergeMap, take, tap} from 'rxjs/operators';
import {Dashboard} from '../../package/component/dashboard/dashboard';
import {Config, RepoConfig} from '../../service/config';
import {ConfirmConfigUpdates} from '../shared/dialog/confirm-config-updates/confirm-config-updates';
import {ConfigStore} from './dao/config/config-dao';
import {Query} from './dao/config/query';
import {Recommendation} from './dao/config/recommendation';
import {compareLocalToRemote, IdentifiedObject, LocalToRemoteComparison} from './dao/list-dao';

@Injectable()
export class RepoGist {
  private destroyed = new Subject();

  constructor(private config: Config, private dialog: MatDialog) {}

  sync(repository: string, store: ConfigStore): Observable<void> {
    let syncResults: LocalToRemoteComparison<IdentifiedObject>[]|null;
    return this.config.getRepoConfig(repository)
        .pipe(
            mergeMap(repoConfig => getSyncResults(store, repoConfig)),
            tap(results => syncResults = results), mergeMap(results => this.confirmSync(results)),
            map(confirmed => {
              if (!confirmed) {
                // TODO: Perhaps update the modified date on the update items to make sure
                // the local versions now have a later modified date for next time the comparison
                // is made.
                return;
              }

              const dashboardsSync = syncResults![0] as LocalToRemoteComparison<Dashboard>;
              store.dashboards.add(dashboardsSync.toAdd);
              store.dashboards.update(dashboardsSync.toUpdate);
              store.dashboards.remove(dashboardsSync.toRemove.map(v => v.id!));

              const querySync = syncResults![1] as LocalToRemoteComparison<Query>;
              store.queries.add(querySync.toAdd);
              store.queries.update(querySync.toUpdate);
              store.queries.remove(querySync.toRemove.map(v => v.id!));

              const recommendationsSync =
                  syncResults![2] as LocalToRemoteComparison<Recommendation>;
              store.recommendations.add(recommendationsSync.toAdd);
              store.recommendations.update(recommendationsSync.toUpdate);
              store.recommendations.remove(recommendationsSync.toRemove.map(v => v.id!));
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
function getSyncResults(store: ConfigStore, remoteConfig: RepoConfig|null):
    Observable<LocalToRemoteComparison<any>[]|null> {
  if (!remoteConfig) {
    return of(null);
  }

  return combineLatest(store.dashboards.list, store.queries.list, store.recommendations.list)
      .pipe(
          map(results =>
                  [compareLocalToRemote(results[0]!, remoteConfig.dashboards),
                   compareLocalToRemote(results[1]!, remoteConfig.queries),
                   compareLocalToRemote(results[2]!, remoteConfig.recommendations)]),
          take(1));
}
