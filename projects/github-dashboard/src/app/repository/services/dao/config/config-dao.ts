import {Injectable} from '@angular/core';
import {Dashboard} from '@crafted/components';
import {Config} from 'projects/github-dashboard/src/app/service/config';
import {combineLatest, Subject} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';
import {AppIndexedDb} from '../../../utility/app-indexed-db';
import {RepoGist} from '../../repo-gist';
import {ListDao} from '../list-dao';
import {Query} from './query';
import {Recommendation} from './recommendation';

export interface ConfigStore {
  dashboards: ListDao<Dashboard>;
  queries: ListDao<Query>;
  recommendations: ListDao<Recommendation>;
}

export type ConfigDaoType = 'dashboards'|'queries'|'recommendations';

@Injectable()
export class ConfigDao {
  private stores: Map<string, ConfigStore> = new Map();

  private destroyed = new Subject();

  constructor(private config: Config, private repoGist: RepoGist) {}

  get(name: string): ConfigStore {
    if (!this.stores.has(name)) {
      const appIndexedDb = new AppIndexedDb(name);
      const newStore = {
        name,
        dashboards: new ListDao<Dashboard>('dashboards', appIndexedDb),
        queries: new ListDao<Query>('queries', appIndexedDb),
        recommendations: new ListDao<Recommendation>('recommendations', appIndexedDb),
      };
      this.stores.set(name, newStore);

      // Sync and then start saving
      this.repoGist.sync(name, newStore).pipe(take(1)).subscribe(() => {
        this.saveConfigChangesToGist(name, newStore);
      });
    }

    return this.stores.get(name);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  /** Persist changes to config lists to gist */
  saveConfigChangesToGist(repository: string, store: ConfigStore) {
    const configDaoLists = [store.dashboards.list, store.queries.list, store.recommendations.list];
    combineLatest(...configDaoLists)
        .pipe(debounceTime(500), takeUntil(this.destroyed))
        .subscribe(result => {
          const dashboards = result[0];
          const queries = result[1];
          const recommendations = result[2];

          this.config.saveRepoConfigToGist(repository, {dashboards, queries, recommendations});
        });
  }
}
