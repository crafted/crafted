import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AuthSignIn, AuthSignOut} from '../../../store/auth/auth.action';
import {selectAuthState} from '../../../store/auth/auth.reducer';
import {selectLoadedRepos} from '../../../store/loaded-repos/loaded-repos.reducer';
import {selectQueryList} from '../../store/query/query.reducer';
import {selectDashboards} from '../../store/dashboard/dashboard.reducer';
import {selectRecommendations} from '../../store/recommendation/recommendation.reducer';
import {ThemeToggle} from '../../../store/theme/theme.action';
import {selectIsDarkTheme} from '../../../store/theme/theme.reducer';
import {AppState} from '../../store';
import {selectItemTotal} from '../../store/item/item.reducer';
import {selectRepositoryName} from '../../store/repository/repository.reducer';

export interface NavLink {
  route: string;
  label: string;
  icon: string;
  subRoute?: string;
  subItems?: Observable<any[]>;
  disabled?: Observable<boolean>;
}

@Component({
  selector: 'nav-content',
  templateUrl: 'nav.html',
  styleUrls: ['nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Nav {
  isDarkTheme = this.store.select(selectIsDarkTheme);

  user = this.store.select(selectAuthState).pipe(map(authState => authState.userName));

  accessToken = this.store.select(selectAuthState).pipe(map(authState => authState.accessToken));

  activeRepository = this.store.select(selectRepositoryName);

  isEmpty = this.store.select(selectItemTotal).pipe(map(total => total === 0));

  links: NavLink[] = [
    {
      route: 'dashboards',
      subRoute: 'dashboard',
      label: 'Dashboards',
      icon: 'dashboard',
      disabled: this.isEmpty,
      subItems: this.store.select(selectDashboards).pipe(take(5))
    },
    {
      route: 'queries',
      subRoute: 'query',
      label: 'Queries',
      icon: 'find_in_page',
      disabled: this.isEmpty,
      subItems: this.store.select(selectQueryList).pipe(take(5))
    },
  ];

  configLinks: NavLink[] = [
    {
      route: 'recommendations',
      label: 'Recommendations',
      icon: 'label',
      disabled: this.isEmpty,
      subItems: this.store.select(selectRecommendations)
    },
    {route: 'database', label: 'Database', icon: 'archive'},
  ];

  repositories$ = combineLatest(this.activeRepository, this.store.select(selectLoadedRepos))
                      .pipe(map(([repository, loadedRepos]) => {
                        const repositoriesSet = new Set([repository, ...loadedRepos]);
                        const repositories = [];
                        repositoriesSet.forEach(r => repositories.push(r));
                        return repositories;
                      }));

  @Input() sidenav: MatSidenav;

  private destroyed = new Subject();

  constructor(
      private store: Store<AppState>,
      public router: Router) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  navigateHome() {
    this.router.navigate(['../..']);
  }

  signIn() {
    this.store.dispatch(new AuthSignIn());
  }

  signOut() {
    this.store.dispatch(new AuthSignOut());
  }

  toggleTheme() {
    this.store.dispatch(new ThemeToggle());
  }
}
