import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AppState} from '../../store';
import {LoadRepository} from '../../store/repository/repository.action';

// tslint:disable-next-line:no-empty-interface
export interface RepoState {
}

@Injectable()
export class ActiveStore {
  state: Observable<RepoState> = this.activatedRoute.firstChild.params.pipe(
    map(params => `${params.org}/${params.name}`), map(repository => {
      this.store.dispatch(new LoadRepository({name: repository}));
      return {};
    }),
    shareReplay(1));

  constructor(private activatedRoute: ActivatedRoute, private store: Store<AppState>) {
  }
}
