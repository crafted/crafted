import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Dashboard} from '@crafted/components';
import {map, shareReplay} from 'rxjs/operators';
import {Contributor} from '../../github/app-types/contributor';
import {Item} from '../../github/app-types/item';
import {Label} from '../../github/app-types/label';
import {Query} from '../model/query';
import {Recommendation} from '../model/recommendation';
import {AppIndexedDb} from '../utility/app-indexed-db';
import {ListDao} from '../utility/list-dao';

export interface RepoState {
  repository: string;
  itemsDao: ListDao<Item>;
  labelsDao: ListDao<Label>;
  contributorsDao: ListDao<Contributor>;
  dashboardsDao?: ListDao<Dashboard>;
  queriesDao?: ListDao<Query>;
  recommendationsDao?: ListDao<Recommendation>;
}

@Injectable()
export class ActiveStore {
  private repoStateCache = new Map<string, RepoState>();

  state = this.activatedRoute.firstChild.params.pipe(
    map(params => `${params.org}/${params.name}`), map(repository => {
      if (!this.repoStateCache.has(repository)) {
        this.repoStateCache.set(repository, createRepoState(repository));
      }

      return this.repoStateCache.get(repository);
    }),
    shareReplay(1));

  constructor(private activatedRoute: ActivatedRoute) {
  }
}

function createRepoState(repository: string): RepoState {
  const appIndexedDb = new AppIndexedDb(repository);
  return {
    repository,
    itemsDao: new ListDao<Item>('items', appIndexedDb),
    labelsDao: new ListDao<Label>('labels', appIndexedDb),
    contributorsDao: new ListDao<Contributor>('contributors', appIndexedDb),
    dashboardsDao: new ListDao<Item>('dashboards', appIndexedDb),
    recommendationsDao: new ListDao<Label>('recommendations', appIndexedDb),
    queriesDao: new ListDao<Contributor>('queries', appIndexedDb),
  };
}
