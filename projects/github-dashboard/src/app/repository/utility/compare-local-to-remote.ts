export interface IdentifiedObject {
  id?: string;
  dbAdded?: string;
  dbModified?: string;
}

// Combine toAdd and toUpdate
export interface LocalToRemoteComparison<T> {
  toAdd: T[];
  toUpdate: T[];
  toRemove: T[];
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

/** Creates a new map of the items keys on their id property. */
function createMap<T extends IdentifiedObject>(items: T[]) {
  const valuesMap = new Map<string, T>();
  items.forEach(item => valuesMap.set(item.id, item));
  return valuesMap;
}
