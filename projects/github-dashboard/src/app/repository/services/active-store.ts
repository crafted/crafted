import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, shareReplay} from 'rxjs/operators';
import {ConfigDao} from './dao/config/config-dao';
import {DataDao} from './dao/data-dao';

@Injectable()
export class ActiveStore {
  repository = this.activatedRoute.firstChild.params.pipe(
    map(params => `${params.org}/${params.name}`), shareReplay(1));
  data = this.repository.pipe(map(r => this.dataDao.get(r)), shareReplay(1));
  config = this.repository.pipe(map(r => this.configDao.get(r)), shareReplay(1));

  constructor(
    private activatedRoute: ActivatedRoute, private dataDao: DataDao,
    private configDao: ConfigDao) {
  }
}
