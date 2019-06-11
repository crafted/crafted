import {DB, deleteDb, ObjectStore, openDb} from 'idb';
import {ReplaySubject, Subject} from 'rxjs';
import {DEMO_DASHBOARDS} from '../repository/utility/demo-config/demo-dashboards';
import {DEMO_RECOMMENDATIONS} from '../repository/utility/demo-config/demo-recommendations';

const DB_VERSION = 1;

// TODO: Use enum
export type StoreId = 'items'|'labels'|'contributors'|'dashboards'|'queries'|'recommendations';

export const STORE_IDS: StoreId[] =
    ['items', 'labels', 'contributors', 'dashboards', 'queries', 'recommendations'];

export class AppIndexedDb {
  initialValues: {[key in StoreId]?: Subject<any[]>} = {};

  name: string;

  private db: Promise<DB>;

  private destroyed = new Subject();

  constructor(name: string) {
    STORE_IDS.forEach(id => this.initialValues[id] = new ReplaySubject<any[]>(1));
    this.name = name;
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
    this.db = openDb(this.name, DB_VERSION, db => {
      STORE_IDS.forEach(collectionId => {
        if (!db.objectStoreNames.contains(collectionId)) {
          const objectStore = db.createObjectStore(collectionId, {keyPath: 'id'});

          if (this.name === 'angular/components') {
            initializeDemoConfig(collectionId, objectStore);
          }
        }
      });
    });
    this.db.then(() => this.initializeAllValues());
  }

  private initializeAllValues() {
    STORE_IDS.forEach(id => {
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

function initializeDemoConfig(collectionId: string, objectStore: ObjectStore<any, any>) {
  switch (collectionId) {
    case 'dashboards':
      DEMO_DASHBOARDS.forEach(d => objectStore.add(d));
      break;
    case 'queries':
      // TODO: Add some demo queries
      break;
    case 'recommendations':
      DEMO_RECOMMENDATIONS.forEach(d => objectStore.add(d));
      break;

  }
}
