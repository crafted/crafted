import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';

import {AppIndexedDb} from '../../repository/utility/app-indexed-db';
import {LoadContributorsFromLocalDb} from '../contributor/contributor.action';
import {AppState} from '../index';
import {LoadItemsFromLocalDb} from '../item/item.action';
import {LoadLabelsFromLocalDb} from '../label/label.action';

import {LocalDbActionTypes, UpdateLocalDbEntities} from './local-db.actions';

@Injectable()
export class LocalDbEffects {
  private openLocalDatabases = new Map<string, AppIndexedDb>();

  @Effect()
  load = this.actions.pipe(
    ofType(LocalDbActionTypes.LOAD),
    mergeMap(() => this.store.select(state => state.repository.name)),
    switchMap(repository => {
      const localDb = this.getLocalDatabase(repository);

      const initialValues = [
        localDb.initialValues.items,
        localDb.initialValues.labels,
        localDb.initialValues.contributors,
        localDb.initialValues.dashboards,
        localDb.initialValues.queries,
        localDb.initialValues.recommendations,
      ];

      return combineLatest(...initialValues);
    }),
    switchMap(result => {
      return [
        new LoadItemsFromLocalDb({items: result[0]}),
        new LoadLabelsFromLocalDb({labels: result[1]}),
        new LoadContributorsFromLocalDb({contributors: result[2]})
      ];
    }));

  @Effect({dispatch: false})
  update = this.actions.pipe(
    ofType<UpdateLocalDbEntities>(LocalDbActionTypes.UPDATE_ENTITIES),
    withLatestFrom(this.store.select(state => state.repository.name)),
    tap(([action, repository]) => {
      const localDb = this.getLocalDatabase(repository);
      localDb.updateValues(action.payload.entities, action.payload.type);
    }));

  constructor(private actions: Actions, private store: Store<AppState>) {}

  private getLocalDatabase(repository: string) {
    if (!this.openLocalDatabases.has(repository)) {
      this.openLocalDatabases.set(repository, new AppIndexedDb(repository));
    }

    return this.openLocalDatabases.get(repository);
  }
}
