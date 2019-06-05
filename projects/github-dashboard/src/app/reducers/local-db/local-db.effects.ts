import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {combineLatest} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {AppIndexedDb} from '../../repository/utility/app-indexed-db';
import {AddAllItems} from '../item/item.action';

import {LoadLocalDb, LocalDbActionTypes} from './local-db.actions';

@Injectable()
export class LocalDbEffects {
  openDatabases = new Map<string, AppIndexedDb>();

  @Effect()
  load = this.actions.pipe(
      ofType(LocalDbActionTypes.LOAD), switchMap((a: LoadLocalDb) => {
        const repository = a.payload.repository;
        const appIndexedDb = new AppIndexedDb(repository);

        const initialValues = [
          appIndexedDb.initialValues.items,
          appIndexedDb.initialValues.labels,
          appIndexedDb.initialValues.contributors,
          appIndexedDb.initialValues.dashboards,
          appIndexedDb.initialValues.queries,
          appIndexedDb.initialValues.recommendations,
        ];

        return combineLatest(...initialValues);
      }),
      switchMap(initialValues => {
        return [
          new AddAllItems({items: initialValues[0]})
        ];
      }));

  constructor(private actions: Actions) {}
}
