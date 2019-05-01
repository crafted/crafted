import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
import {ActiveStore} from '../services/active-store';
import {RepoDaoType} from '../services/dao/data-dao';
import {Remover} from '../services/remover';
import {isRepoStoreEmpty} from '../utility/is-repo-store-empty';


@Component({
  selector: 'database-page',
  styleUrls: ['database-page.scss'],
  templateUrl: 'database-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatabasePage {
  isLoading = false;

  isEmpty = this.activeRepo.data.pipe(mergeMap(store => isRepoStoreEmpty(store)));

  isLoaded = combineLatest(this.activeRepo.name, this.loadedRepos.repos$)
    .pipe(map(results => results[1].indexOf(results[0]) !== -1));

  repoLabels = this.activeRepo.data.pipe(
      mergeMap(store => store.labels.list), map(labels => labels.map(l => l.id)));

  repoDaoTypeInfo: {type: RepoDaoType, label: string, count: Observable<number>}[] = [
    {
      type: 'items',
      label: 'Issues and pull requests',
      count: this.activeRepo.data.pipe(mergeMap(s => s.items.list), map(l => l.length))
    },
    {
      type: 'labels',
      label: 'Labels',
      count: this.activeRepo.data.pipe(mergeMap(s => s.labels.list), map(l => l.length))
    },
    {
      type: 'contributors',
      label: 'Contributors',
      count: this.activeRepo.data.pipe(mergeMap(s => s.contributors.list), map(l => l.length))
    },
  ];

  constructor(
    public activeRepo: ActiveStore, private loadedRepos: LoadedRepos, public remover: Remover,
    private router: Router, private activatedRoute: ActivatedRoute) {
  }

  remove() {
    this.remover.removeAllData(this.activeRepo.activeData, true);
  }

  navigateToNewQuery() {
    this.router.navigate(['../../../query/new'], {relativeTo: this.activatedRoute});
  }
}
