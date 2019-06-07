import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Label} from '../../github/app-types/label';
import {AppState} from '../../store';
import {LoadRepository} from '../../store/repository/repository.action';
import {Recommendation} from '../model/recommendation';
import {AppIndexedDb} from '../utility/app-indexed-db';
import {ListDao} from '../utility/list-dao';

export interface RepoState {
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
    recommendationsDao: new ListDao<Label>('recommendations', appIndexedDb),
  };
}
