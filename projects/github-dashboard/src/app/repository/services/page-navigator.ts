import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

interface QueryQueryParams {
  recommendationId?: string;
}

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

  navigateToQuery(id: string = 'new', queryParams?: QueryQueryParams) {
    this.navigate(`query/${id}`, queryParams);
  }

  navigateToDashboard(id: string) {
    this.navigate(`dashboard/${id}`);
  }

  private navigate(subPath: string, queryParams?: QueryQueryParams) {
    const extras: NavigationExtras = {queryParams};
    this.router.navigate([`${this.repository}/${subPath}`], extras);
  }
}
