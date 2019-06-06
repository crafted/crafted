import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
import {AppState} from '../../store';
import {ActiveStore} from '../services/active-store';
import {Remover} from '../services/remover';
import {isRepoStoreEmpty} from '../utility/is-repo-store-empty';

@Component({
  selector: 'database-page',
  styleUrls: ['database-page.scss'],
  templateUrl: 'database-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabasePage {
  activeRepository = this.store.select(state => state.repository.name);

  isLoading = false;

  isEmpty = this.activeStore.state.pipe(mergeMap(store => isRepoStoreEmpty(store, this.store)));

  isLoaded = combineLatest(this.activeRepository, this.loadedRepos.repos$)
    .pipe(map(([repository, repos]) => repos.indexOf(repository) !== -1));

  repoLabels = this.activeStore.state.pipe(
    mergeMap(repoState => repoState.labelsDao.list), map(labels => labels.map(l => l.id)));

  counts = {
    items: this.store.pipe(select(state => state.items), map(result => result.ids.length)),
    labels: this.activeStore.state.pipe(mergeMap(s => s.labelsDao.list), map(l => l.length)),
    contributors: this.activeStore.state.pipe(mergeMap(s => s.contributorsDao.list), map(l => l.length)),
  };

  constructor(
    public activeStore: ActiveStore, private loadedRepos: LoadedRepos, public remover: Remover, private store: Store<AppState>) {
  }

  remove() {
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      this.remover.removeAllData(repoState, true);
    });
  }
}
