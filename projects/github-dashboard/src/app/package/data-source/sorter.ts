import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Group} from './grouper';

export interface SorterState<S = any> {
  sort: S;
  reverse: boolean;
}

export type SortComparator<T, C> = (context: C) => ((a: T, b: T) => number);

export interface SortingMetadata<T = any, S = any, C = any> {
  id: S;
  label: string;
  comparator: SortComparator<T, C>;
}

export type SorterContextProvider<C> = Observable<C>;

function sortItems<T, C>(
    items: T[], comparator: SortComparator<T, C>, reverse: boolean, context: C) {
  items.sort(comparator(context));

  if (reverse) {
    items.reverse();
  }

  return items;
}

export class Sorter<T = any, S = any, C = any> {
  state = new ReplaySubject<SorterState<S>>(1);

  constructor(
      public metadata: Map<S, SortingMetadata<T, S, C>>,
      private contextProvider: SorterContextProvider<C>) {}

  sort(): (items: Observable<T[]>) => Observable<T[]> {
    return (items: Observable<T[]>) => {
      return combineLatest(items, this.state, this.contextProvider).pipe(map(results => {
        const sortMetadata = this.metadata.get(results[1].sort);
        if (!sortMetadata) {
          throw new Error(`No configuration set up for sort ${results[1].sort}`);
        }

        return sortItems(results[0], sortMetadata.comparator, results[1].reverse, results[2]);
      }));
    };
  }

  sortGroupedItems(): (items: Observable<Group<T>[]>) => Observable<Group<T>[]> {
    return (itemGroups: Observable<Group<T>[]>) => {
      return combineLatest(itemGroups, this.state, this.contextProvider).pipe(map(results => {
        const sortMetadata = this.metadata.get(results[1].sort);
        if (!sortMetadata) {
          throw new Error(`No configuration set up for sort ${results[1].sort}`);
        }

        results[0].forEach(itemGroup => {
          sortItems(itemGroup.items, sortMetadata.comparator, results[1].reverse, results[2]);
        });

        return results[0];
      }));
    };
  }

  getSorts(): SortingMetadata<T, S, C>[] {
    const sorts: SortingMetadata<T, S, C>[] = [];
    this.metadata.forEach(sort => sorts.push(sort));
    return sorts;
  }

  setState(state: SorterState<S>) {
    this.state.next({...state});
  }

  isEquivalent(otherState?: SorterState<any>): Observable<boolean> {
    return this.state.pipe(map(state => {
      if (!otherState) {
        return false;
      }
      return state.sort === otherState.sort && state.reverse === otherState.reverse;
    }));
  }
}
