import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {mergeMap, switchMap} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/repository-database';
import {LoadContributorsFromLocalDb} from '../contributor/contributor.action';
import {LoadDashboardsFromLocalDb} from '../dashboard/dashboard.action';
import {LoadItemsFromLocalDb} from '../item/item.action';
import {LoadLabelsFromLocalDb} from '../label/label.action';
import {LoadQueriesFromLocalDb} from '../query/query.action';
import {LoadRecommendationsFromLocalDb} from '../recommendation/recommendation.action';

import {LoadRepository, RepositoryActionTypes} from './repository.action';

@Injectable()
export class RepositoryEffects {
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

  constructor(
      private actions: Actions, private router: Router,
      private repositoryDatabase: RepositoryDatabase) {}
}
