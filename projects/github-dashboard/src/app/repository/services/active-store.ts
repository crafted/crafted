import {Injectable} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {ConfigDao, ConfigStore} from './dao/config/config-dao';
import {Dao, DataStore} from './dao/data-dao';

@Injectable()
export class ActiveStore {
  get activeData(): DataStore {
    return this.data.value;
  }

  get activeConfig(): ConfigStore {
    return this.config.value;
  }

  get activeName(): string {
    return this.activeData.name;
  }

  data = new BehaviorSubject<DataStore>(
      this.getStoreFromParams(this.activatedRoute.firstChild!.snapshot.params));

  config = new BehaviorSubject<ConfigStore>(
      this.getConfigStoreFromParams(this.activatedRoute.firstChild!.snapshot.params));

  name = this.data.pipe(map(store => store.name));

  private destroyed = new Subject();

  constructor(
      private activatedRoute: ActivatedRoute, private dao: Dao, private configDao: ConfigDao) {
    this.activatedRoute.firstChild!.params.pipe(takeUntil(this.destroyed)).subscribe(params => {
      this.data.next(this.getStoreFromParams(params));
      this.config.next(this.getConfigStoreFromParams(params));
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getStoreFromParams(params: Params) {
    const repository = `${params['org']}/${params['name']}`;
    return this.dao.get(repository);
  }

  private getConfigStoreFromParams(params: Params) {
    const repository = `${params['org']}/${params['name']}`;
    return this.configDao.get(repository);
  }
}
