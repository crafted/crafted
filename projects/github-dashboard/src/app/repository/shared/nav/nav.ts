import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Auth} from '../../../service/auth';
import {LoadedRepos} from '../../../service/loaded-repos';
import {AppState} from '../../../store';
import {Theme} from '../../services/theme';

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
  activeRepository = this.store.select(state => state.repository.name);

  isEmpty = this.store.select(store => store.items).pipe(map(items => !items.ids.length));

  links: NavLink[] = [
    {route: 'database', label: 'Database', icon: 'archive'},
    {route: 'dashboards', label: 'Dashboards', icon: 'dashboard', disabled: this.isEmpty},
    {route: 'queries', label: 'Queries', icon: 'find_in_page', disabled: this.isEmpty},
    {route: 'recommendations', label: 'Recommendations', icon: 'label', disabled: this.isEmpty},
  ];

  repositories$ = combineLatest(this.activeRepository, this.loadedRepos.repos$)
                      .pipe(map(([repository, loadedRepos]) => {
                        const repositoriesSet = new Set([repository, ...loadedRepos]);
                        const repositories = [];
                        repositoriesSet.forEach(r => repositories.push(r));
                        return repositories;
                      }));

  @Input() sidenav: MatSidenav;

  private destroyed = new Subject();

  constructor(
      private store: Store<AppState>, public loadedRepos: LoadedRepos, public theme: Theme,
      public router: Router, public auth: Auth) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  navigateHome() {
    this.router.navigate(['../..']);
  }
}
