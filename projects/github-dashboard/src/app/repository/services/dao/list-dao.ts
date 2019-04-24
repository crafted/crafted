import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {AppIndexedDb, StoreId} from '../../utility/app-indexed-db';

export interface IdentifiedObject {
  id?: string;
  dbAdded?: string;
  dbModified?: string;
}

export interface LocalToRemoteComparison<T> {
  toAdd: T[];
  toUpdate: T[];
  toRemove: T[];
}

export class ListDao<T extends IdentifiedObject> {
  rawList = new BehaviorSubject<T[]|null>(null);
  list = this.rawList.pipe(filter(v => !!v)) as Observable<T[]>;

  get map(): BehaviorSubject<Map<string, T>> {
    if (!this._map) {
      this._map = new BehaviorSubject<Map<string, T>>(new Map<string, T>());
      this.list.subscribe(list => {
        const valuesMap = new Map<string, T>();
        list.forEach(obj => valuesMap.set(obj.id, obj));
        this._map.next(valuesMap);
      });
    }

    return this._map;
  }
  _map: BehaviorSubject<Map<string, T>>;

  private repoIndexedDb: AppIndexedDb;

  constructor(protected collectionId: StoreId, repoIndexedDb: AppIndexedDb) {
    this.repoIndexedDb = repoIndexedDb;
    const initialValues = this.repoIndexedDb.initialValues[this.collectionId];
    if (!initialValues) {
      throw Error('Object store not initialized: ' + this.collectionId);
    }

    initialValues.pipe(take(1)).subscribe(values => this.rawList.next(values));
  }

  add(item: T): string;
  add(items: T[]): string[];
  add(itemOrItems: T|T[]): string|string[] {
    const items = (itemOrItems instanceof Array) ? itemOrItems : [itemOrItems];
    items.forEach(decorateForDb);
    this.repoIndexedDb.updateValues(items, this.collectionId);
    this.rawList.next([...(this.rawList.value || []), ...items]);
    return items.map(obj => obj.id);
  }

  get(id: string): Observable<T|null> {
    return this.map.pipe(map(v => (v && v.get(id)) ? v.get(id) : null));
  }

  update(itemOrItems: T|T[]): void {
    const items = (itemOrItems instanceof Array) ? itemOrItems : [itemOrItems];
    items.forEach(obj => {
      if (!obj.id) {
        throw new Error('Must have an on the object in order to update: ' + JSON.stringify(obj));
      }
    });

    items.forEach(decorateForDb);
    this.repoIndexedDb.updateValues(items, this.collectionId);

    this.map.pipe(filter(v => !!v), take(1)).subscribe(v => {
      items.forEach(obj => {
        v.set(obj.id, {...(v.get(obj.id) as object), ...(obj as object)} as T);
      });

      const values: T[] = [];
      v.forEach(value => values.push(value));
      this.rawList.next(values);
    });
  }

  remove(idOrIds: string|string[]) {
    const ids = (idOrIds instanceof Array) ? idOrIds : [idOrIds];
    this.repoIndexedDb.removeValues(ids, this.collectionId);

    this.map.pipe(filter(values => !!values), take(1)).subscribe(v => {
      ids.forEach(id => v.delete(id));

      const values: T[] = [];
      v.forEach(value => values.push(value));
      this.rawList.next(values);
    });
  }

  removeAll() {
    this.repoIndexedDb
      .removeValues((this.rawList.value || []).map(item => item.id), this.collectionId)
        .then(() => {
          this.rawList.next([]);
        });
  }
}

function decorateForDb(obj: any) {
  if (!obj.id) {
    obj.id = createId();
  }

  if (!obj.dbAdded) {
    obj.dbAdded = new Date().toISOString();
  }

  obj.dbModified = new Date().toISOString();
}

function createId(): string {
  return Math.random().toString(16).substring(2);
}

/** Creates a new map of the items keys on their id property. */
function createMap<T extends IdentifiedObject>(items: T[]) {
  const valuesMap = new Map<string, T>();
  items.forEach(item => valuesMap.set(item.id, item));
  return valuesMap;
}

/** Compares the values to see what changes would occur to sync from local to remote */
export function compareLocalToRemote<T extends IdentifiedObject>(
    local: T[], remote: T[]): LocalToRemoteComparison<T> {
  const localMap = createMap(local);
  const remoteMap = createMap(remote);

  // Item is removed if it exists in the local list but not in the remote.
  const toRemove: T[] = [];
  localMap.forEach((v, k) => {
    if (!remoteMap.has(k)) {
      toRemove.push(v);
    }
  });

  // Item is added if it exists in the remote list but not in the local.
  const toAdd: T[] = [];
  remoteMap.forEach((v, k) => {
    if (!localMap.has(k)) {
      toAdd.push(v);
    }
  });

  // Item is updated if it exists in both the local and remote lists,
  // but is modified later in remote.
  const toUpdate: T[] = [];
  localMap.forEach((localValue, k) => {
    const remoteValue = remoteMap.get(k);
    if (remoteValue) {
      const localModifiedDate = localValue.dbModified;
      const remoteModifiedDate = remoteValue.dbModified;
      if (remoteModifiedDate > localModifiedDate) {
        toUpdate.push(remoteValue);
      }
    }
  });

  return {toAdd, toUpdate, toRemove};
}
