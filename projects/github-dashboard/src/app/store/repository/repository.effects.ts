import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {LoadLocalDb} from '../local-db/local-db.actions';

import {LoadRepository, RepositoryActionTypes, UnloadRepository} from './repository.action';

@Injectable()
export class RepositoryEffects {
  @Effect()
  activeRepository = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), map((navigationEnd: NavigationEnd) => {
        const url = navigationEnd.urlAfterRedirects;

        if (url === '/') {
          return '';
        }

        const urlParts = url.split('/');
        return `${urlParts[1]}/${urlParts[2]}`;
      }),
      distinctUntilChanged(),
      map(name => name ? new LoadRepository({name}) : new UnloadRepository()));

  @Effect()
  load = this.actions.pipe(ofType(RepositoryActionTypes.LOAD), map(() => new LoadLocalDb()));

  constructor(private actions: Actions, private router: Router) {}
}
