import {Injectable} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {map, shareReplay} from 'rxjs/operators';
import {ConfigDao} from './dao/config/config-dao';
import {DataDao} from './dao/data-dao';

@Injectable()
export class ActiveStore {
  data = this.activatedRoute.firstChild.params.pipe(
    map(params => this.dataDao.get(getRepository(params))), shareReplay(1));
  config = this.activatedRoute.firstChild.params.pipe(
    map(params => this.configDao.get(getRepository(params))), shareReplay(1));
  name = this.data.pipe(map(store => store.name));

  constructor(
    private activatedRoute: ActivatedRoute, private dataDao: DataDao,
    private configDao: ConfigDao) {
  }
}

function getRepository(params: Params) {
  return `${params.org}/${params.name}`;
}
