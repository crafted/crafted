import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {mergeMap, take, tap} from 'rxjs/operators';
import {AppState} from '../index';
import {LoadedReposActionTypes} from './loaded-repos.action';
import {LOADED_REPOS_STORAGE_KEY, selectLoadedReposState} from './loaded-repos.reducer';
import {LoadedReposState} from './loaded-repos.state';

@Injectable()
export class LoadedReposEffects {
  @Effect({dispatch: false})
  persistLoadedReposToStorage = this.actions.pipe(
      ofType(LoadedReposActionTypes.ADD, LoadedReposActionTypes.REMOVE),
      mergeMap(() => this.store.select(selectLoadedReposState).pipe(take(1))),
      tap(saveLoadedReposStateToStorage));

  constructor(private actions: Actions, private store: Store<AppState>) {}
}

function saveLoadedReposStateToStorage(loadedReposState: LoadedReposState) {
  window.localStorage.setItem(
      LOADED_REPOS_STORAGE_KEY.LOADED_REPOS, loadedReposState.loadedRepos.join(','));
}
