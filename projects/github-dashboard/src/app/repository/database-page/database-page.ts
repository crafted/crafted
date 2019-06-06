import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
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

  isEmpty = isRepoStoreEmpty(this.store);

  isLoaded = combineLatest(this.activeRepository, this.loadedRepos.repos$)
                 .pipe(map(([repository, repos]) => repos.indexOf(repository) !== -1));

  repoLabels = this.store.select(state => state.labels.ids);

  counts = {
    items: this.store.pipe(select(state => state.items.ids.length)),
    labels: this.store.pipe(select(state => state.labels.ids.length)),
    contributors: this.store.pipe(select(state => state.contributors.ids.length)),
  };

  constructor(
      public activeStore: ActiveStore, private loadedRepos: LoadedRepos, public remover: Remover,
      private store: Store<AppState>) {}

  remove() {
    this.remover.removeAllData(true);
  }
}
