import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs';
import {AppIndexedDb, StoreId} from '../utility/app-indexed-db';

@Injectable({providedIn: 'root'})
export class RepositoryDatabase {
  private openDatabases = new Map<string, AppIndexedDb>();

  getValues(repository: string) {
    const db = this.getDatabase(repository);
    const initialValues = [
      db.initialValues.items,
      db.initialValues.labels,
      db.initialValues.contributors,
      db.initialValues.dashboards,
      db.initialValues.queries,
      db.initialValues.recommendations,
    ];

    return combineLatest(...initialValues);
  }

  update(repository: string, type: StoreId, entities: any[]) {
    this.getDatabase(repository).updateValues(entities, type);
  }

  remove(repository: string, type: StoreId, ids: string[]) {
    this.getDatabase(repository).removeValues(ids, type);
  }

  private getDatabase(repository: string) {
    if (!this.openDatabases.has(repository)) {
      this.openDatabases.set(repository, new AppIndexedDb(repository));
    }

    return this.openDatabases.get(repository);
  }
}
