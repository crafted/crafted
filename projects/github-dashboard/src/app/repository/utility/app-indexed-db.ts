import {DB, deleteDb, openDb} from 'idb';
import {Subject} from 'rxjs';

const DB_VERSION = 1;

export type StoreId = 'items'|'labels'|'contributors'|'dashboards'|'queries'|'recommendations';

export const StoreIds: StoreId[] =
    ['items', 'labels', 'contributors', 'dashboards', 'queries', 'recommendations'];

export class AppIndexedDb {
  initialValues: {[key in StoreId]?: Subject<any[]>} = {};

  name: string;

  private db: Promise<DB>;

  private destroyed = new Subject();

  constructor(name: string) {
    StoreIds.forEach(id => this.initialValues[id] = new Subject<any[]>());
    this.name = name!;
    this.openDb();
  }

  close() {
    return this.db.then(db => db.close());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  removeData() {
    this.db
        .then(db => {
          db.close();
          return deleteDb(this.name);
        })
        .then(() => this.openDb());
  }

  updateValues(values: any[], collectionId: string) {
    return this.db.then(db => {
      const transaction = db.transaction(collectionId, 'readwrite');
      const store = transaction.objectStore(collectionId);
      values.forEach(v => store.put(v));
      return transaction.complete;
    });
  }

  removeValues(ids: string[], collectionId: string) {
    return this.db.then(db => {
      const transaction = db.transaction(collectionId, 'readwrite');
      const store = transaction.objectStore(collectionId);
      ids.forEach(id => store.delete(id));
      return transaction.complete;
    });
  }

  private openDb() {
    this.db = openDb(this.name, DB_VERSION, function(db) {
      StoreIds.forEach(collectionId => {
        if (!db.objectStoreNames.contains(collectionId)) {
          db.createObjectStore(collectionId, {keyPath: 'id'});
        }
      });
    });
    this.db.then(() => this.initializeAllValues());
  }

  private initializeAllValues() {
    StoreIds.forEach(id => {
      this.db.then(db => db.transaction(id, 'readonly').objectStore(id).getAll()).then(result => {
        const initialValues = this.initialValues[id];
        if (!initialValues) {
          throw Error('Object store not initialized :' + id);
        }
        initialValues.next(result);
      });
    });
  }
}
