import {ChangeDetectionStrategy, Component} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
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
  activeRepository = this.activeStore.data.pipe(map(dataStore => dataStore.name));

  isLoading = false;

  isEmpty = this.activeStore.state.pipe(mergeMap(store => isRepoStoreEmpty(store)));

  isLoaded = combineLatest(this.activeRepository, this.loadedRepos.repos$)
    .pipe(map(results => results[1].indexOf(results[0]) !== -1));

  repoLabels = this.activeStore.data.pipe(
      mergeMap(store => store.labels.list), map(labels => labels.map(l => l.id)));

  counts = {
    items: this.activeStore.state.pipe(mergeMap(s => s.itemsDao.list), map(l => l.length)),
    labels: this.activeStore.state.pipe(mergeMap(s => s.labelsDao.list), map(l => l.length)),
    contributors: this.activeStore.state.pipe(mergeMap(s => s.contributorsDao.list), map(l => l.length)),
  };

  constructor(
    public activeStore: ActiveStore, private loadedRepos: LoadedRepos, public remover: Remover) {
  }

  remove() {
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      this.remover.removeAllData(repoState, true);
    });
  }
}
