import {Injectable} from '@angular/core';
import {AppIndexedDb, StoreId} from '../utility/app-indexed-db';

@Injectable({providedIn: 'root'})
export class RepositoryDatabase {
  private database: AppIndexedDb;

  getValues(repository: string) {
    return this.getDatabase(repository).initialValues;
  }

  update(repository: string, type: StoreId, entities: any[]): Promise<any> {
    return this.getDatabase(repository).updateValues(entities, type);
  }

  remove(repository: string, type: StoreId, ids: string[]): Promise<any> {
    return this.getDatabase(repository).removeValues(ids, type);
  }

  removeAll(repository: string, type: StoreId) {
    return this.getDatabase(repository).removeAllValues(type);
  }

  private getDatabase(repository: string) {
    if (this.database && this.database.name === repository) {
      return this.database;
    }

    if (this.database) {
      this.database.close();
    }

    this.database = new AppIndexedDb(repository);
    return this.database;
  }
}
