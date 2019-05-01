import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map, mergeMap, shareReplay} from 'rxjs/operators';
import {Auth} from '../../../service/auth';
import {LoadedRepos} from '../../../service/loaded-repos';
import {ActiveStore} from '../../services/active-store';
import {Theme} from '../../services/theme';
import {isRepoStoreEmpty} from '../../utility/is-repo-store-empty';

export interface NavLink {
  route: string;
  label: string;
  icon: string;
  disabled?: Observable<boolean>;
}

@Component({
  selector: 'nav-content',
  templateUrl: 'nav.html',
  styleUrls: ['nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Nav {
  activeRepository = this.activeStore.data.pipe(map(dataStore => dataStore.name));

  isEmpty = this.activeStore.data.pipe(mergeMap(store => isRepoStoreEmpty(store)), shareReplay(1));

  links: NavLink[] = [
    {route: 'database', label: 'Database', icon: 'archive'},
    {route: 'dashboards', label: 'Dashboards', icon: 'dashboard', disabled: this.isEmpty},
    {route: 'queries', label: 'Queries', icon: 'find_in_page', disabled: this.isEmpty},
    {route: 'recommendations', label: 'Recommendations', icon: 'label', disabled: this.isEmpty},
  ];

  repositories$ =
    combineLatest(this.activeRepository, this.loadedRepos.repos$).pipe(map(results => {
      const repositoriesSet = new Set([results[0], ...results[1]]);
      const repositories = [];
      repositoriesSet.forEach(r => repositories.push(r));
      return repositories;
    }));

  @Input() sidenav: MatSidenav;

  private destroyed = new Subject();

  constructor(
    public activeStore: ActiveStore, public loadedRepos: LoadedRepos, public theme: Theme,
    public router: Router, public auth: Auth) {
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  navigateHome() {
    this.router.navigate(['../..']);
  }
}
