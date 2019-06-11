import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {distinctUntilChanged, filter, map, mergeMap, switchMap} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/local-database';
import {LoadContributorsFromLocalDb} from '../contributor/contributor.action';
import {LoadDashboardsFromLocalDb} from '../dashboard/dashboard.action';
import {LoadItemsFromLocalDb} from '../item/item.action';
import {LoadLabelsFromLocalDb} from '../label/label.action';
import {LoadQueriesFromLocalDb} from '../query/query.action';
import {LoadRecommendationsFromLocalDb} from '../recommendation/recommendation.action';

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
  load = this.actions.pipe(
      ofType<LoadRepository>(RepositoryActionTypes.LOAD),
      switchMap(action => this.repositoryDatabase.getValues(action.payload.name)),
      mergeMap(values => {
        return [
          new LoadItemsFromLocalDb({items: values[0]}),
          new LoadLabelsFromLocalDb({labels: values[1]}),
          new LoadContributorsFromLocalDb({contributors: values[2]}),
          new LoadDashboardsFromLocalDb({dashboards: values[3]}),
          new LoadQueriesFromLocalDb({queries: values[4]}),
          new LoadRecommendationsFromLocalDb({recommendations: values[5]}),
        ];
      }));

  constructor(private actions: Actions, private router: Router, private repositoryDatabase: RepositoryDatabase) {}
}
