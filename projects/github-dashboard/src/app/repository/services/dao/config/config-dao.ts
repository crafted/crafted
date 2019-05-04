import {Injectable} from '@angular/core';
import {Dashboard} from '@crafted/components';
import {Config} from 'projects/github-dashboard/src/app/service/config';
import {Subject} from 'rxjs';
import {AppIndexedDb} from '../../../utility/app-indexed-db';
import {ListDao} from '../list-dao';
import {Query} from './query';
import {Recommendation} from './recommendation';

@Injectable()
export class ConfigDao {
  private stores: Map<string, any> = new Map();

  private destroyed = new Subject();

  constructor(private config: Config) {
  }

  get(name: string): any {
    if (!this.stores.has(name)) {
      const appIndexedDb = new AppIndexedDb(name);
      const newStore = {
        dashboards: new ListDao<Dashboard>('dashboards', appIndexedDb),
        queries: new ListDao<Query>('queries', appIndexedDb),
        recommendations: new ListDao<Recommendation>('recommendations', appIndexedDb),
      };
      this.stores.set(name, newStore);

    }

    return this.stores.get(name);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
