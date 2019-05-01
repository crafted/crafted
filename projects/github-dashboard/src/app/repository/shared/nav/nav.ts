import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {combineLatest, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Auth} from '../../../service/auth';
import {LoadedRepos} from '../../../service/loaded-repos';
import {ActiveStore} from '../../services/active-store';
import {Theme} from '../../services/theme';

export interface NavLink {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'nav-content',
  templateUrl: 'nav.html',
  styleUrls: ['nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Nav {
  links: NavLink[] = [
    {route: 'database', label: 'Database', icon: 'archive'},
    {route: 'dashboards', label: 'Dashboards', icon: 'dashboard'},
    {route: 'queries', label: 'Queries', icon: 'find_in_page'},
    {route: 'recommendations', label: 'Recommendations', icon: 'label'},
  ];

  repositories$ = combineLatest(this.activeStore.name, this.loadedRepos.repos$).pipe(map(results => {
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

