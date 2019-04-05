import {Injectable} from '@angular/core';
import {AppIndexedDb} from '../../utility/app-indexed-db';
import {Contributor} from '../../../github/app-types/contributor';
import {Item} from '../../../github/app-types/item';
import {Label} from '../../../github/app-types/label';
import {ListDao} from './list-dao';

export interface DataStore {
  name: string;
  items: ListDao<Item>;
  labels: ListDao<Label>;
  contributors: ListDao<Contributor>;
}

export type RepoDaoType = 'items'|'labels'|'contributors';

@Injectable()
export class Dao {
  private stores: Map<string, DataStore> = new Map();

  constructor() {}

  get(name: string): DataStore {
    if (!this.stores.has(name)) {
      const appIndexedDb = new AppIndexedDb(name!);
      const newStore: DataStore = {
        name,
        items: new ListDao<Item>('items', appIndexedDb),
        labels: new ListDao<Label>('labels', appIndexedDb),
        contributors: new ListDao<Contributor>('contributors', appIndexedDb),
      };
      this.stores.set(name, newStore);
    }

    return this.stores.get(name)!;
  }
}
