import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
import {ActiveStore} from '../services/active-store';
import {RepoDaoType} from '../services/dao/data-dao';
import {PageNavigator} from '../services/page-navigator';
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

  isEmpty = this.activeStore.data.pipe(mergeMap(store => isRepoStoreEmpty(store)));

  isLoaded = combineLatest(this.activeRepository, this.loadedRepos.repos$)
    .pipe(map(results => results[1].indexOf(results[0]) !== -1));

  repoLabels = this.activeStore.data.pipe(
      mergeMap(store => store.labels.list), map(labels => labels.map(l => l.id)));

  repoDaoTypeInfo: {type: RepoDaoType, label: string, count: Observable<number>}[] = [
    {
      type: 'items',
      label: 'Issues and pull requests',
      count: this.activeStore.data.pipe(mergeMap(s => s.items.list), map(l => l.length))
    },
    {
      type: 'labels',
      label: 'Labels',
      count: this.activeStore.data.pipe(mergeMap(s => s.labels.list), map(l => l.length))
    },
    {
      type: 'contributors',
      label: 'Contributors',
      count: this.activeStore.data.pipe(mergeMap(s => s.contributors.list), map(l => l.length))
    },
  ];

  constructor(
    public activeStore: ActiveStore, private loadedRepos: LoadedRepos, public remover: Remover,
    private router: Router, private activatedRoute: ActivatedRoute, private pageNavigator: PageNavigator) {
  }

  remove() {
    this.activeStore.data.pipe(take(1)).subscribe(dataStore => {
      this.remover.removeAllData(dataStore, true);
    });
  }

  navigateToNewQuery() {
    this.pageNavigator.navigateToQuery();
  }
}
