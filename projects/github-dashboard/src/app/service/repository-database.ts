import {Injectable} from '@angular/core';
import {AppIndexedDb, StoreId} from '../utility/app-indexed-db';

@Injectable({providedIn: 'root'})
export class RepositoryDatabase {
  private openDatabases = new Map<string, AppIndexedDb>();

  getValues(repository: string) {
    return this.getDatabase(repository).initialValues;
  }

  update(repository: string, type: StoreId, entities: any[]): Promise<void> {
    return this.getDatabase(repository).updateValues(entities, type);
  }

  remove(repository: string, type: StoreId, ids: string[]): Promise<void> {
    return this.getDatabase(repository).removeValues(ids, type);
  }

  removeAll(repository: string, type: StoreId) {
    return this.getDatabase(repository).removeAllValues(type);
  }

  private getDatabase(repository: string) {
    if (!this.openDatabases.has(repository)) {
      this.openDatabases.set(repository, new AppIndexedDb(repository));
    }

    return this.openDatabases.get(repository);
  }
}
