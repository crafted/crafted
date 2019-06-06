import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Dashboard} from '@crafted/components';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Contributor} from '../../github/app-types/contributor';
import {Item} from '../../github/app-types/item';
import {Label} from '../../github/app-types/label';
import {AppState} from '../../store';
import {LoadRepository} from '../../store/repository/repository.action';
import {Query} from '../model/query';
import {Recommendation} from '../model/recommendation';
import {AppIndexedDb} from '../utility/app-indexed-db';
import {ListDao} from '../utility/list-dao';

export interface RepoState {
  labelsDao: ListDao<Label>;
  contributorsDao: ListDao<Contributor>;
  dashboardsDao?: ListDao<Dashboard>;
  queriesDao?: ListDao<Query>;
  recommendationsDao?: ListDao<Recommendation>;
}

@Injectable()
export class ActiveStore {
  private repoStateCache = new Map<string, RepoState>();

  state: Observable<RepoState> = this.activatedRoute.firstChild.params.pipe(
    map(params => `${params.org}/${params.name}`), map(repository => {
      if (!this.repoStateCache.has(repository)) {
        this.repoStateCache.set(repository, createRepoState(repository));
      }


      this.store.dispatch(new LoadRepository({name: repository}));
      return this.repoStateCache.get(repository);
    }),
    shareReplay(1));

  constructor(private activatedRoute: ActivatedRoute, private store: Store<AppState>) {
  }
}

function createRepoState(repository: string): RepoState {
  const appIndexedDb = new AppIndexedDb(repository);
  return {
    labelsDao: new ListDao<Label>('labels', appIndexedDb),
    contributorsDao: new ListDao<Contributor>('contributors', appIndexedDb),
    dashboardsDao: new ListDao<Item>('dashboards', appIndexedDb),
    recommendationsDao: new ListDao<Label>('recommendations', appIndexedDb),
    queriesDao: new ListDao<Contributor>('queries', appIndexedDb),
  };
}
