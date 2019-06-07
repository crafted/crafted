import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

@Injectable()
export class PageNavigator {
  constructor(private router: Router) {
  }

  get repository(): string {
    const splitPath = window.location.pathname.split('/');
    return `${splitPath[1]}/${splitPath[2]}`;
  }

  navigateToDatabase() {
    this.navigate('database');
  }

  navigateToQuery(id: string = 'new', extras?: NavigationExtras) {
    this.navigate(`query/${id}`, extras);
  }

  private navigate(subPath: string, extras?: NavigationExtras) {
    this.router.navigate([`${this.repository}/${subPath}`], extras);
  }
}
