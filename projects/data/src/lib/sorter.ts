import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

export interface SorterState {
  sort: string;
  reverse: boolean;
}

export type SortComparator<T, C> = (a: T, b: T, context: C) => number;

export interface SorterMetadata<T = any, C = any> {
  label: string;
  comparator: SortComparator<T, C>;
}

export type SorterContextProvider<C> = Observable<C>;

export interface SortLabel {
  id: string;
  label: string;
}

function sortItems<T, C>(
    items: T[], comparator: SortComparator<T, C>, reverse: boolean, context: C) {
  items.sort((a, b) => comparator(a, b, context));

  if (reverse) {
    items.reverse();
  }

  return items;
}

export class Sorter<T = any, C = any> {
  state = new BehaviorSubject<SorterState>({sort: this.getSorts()[0].id, reverse: false});

  constructor(
      public metadata: Map<string, SorterMetadata<T, C>>,
      private contextProvider?: SorterContextProvider<C>, initialState?: SorterState) {
    if (initialState) {
      this.state.next(initialState);
    }
  }

  sort(): (items: Observable<T[]>) => Observable<T[]> {
    return (items: Observable<T[]>) => {
      const contextProvider = this.contextProvider || of(() => null);
      return combineLatest(items, this.state, contextProvider).pipe(map(results => {
        const sortMetadata = this.metadata.get(results[1].sort);
        if (!sortMetadata) {
          throw new Error(`No configuration set up for sort ${results[1].sort}`);
        }

        return sortItems(results[0], sortMetadata.comparator, results[1].reverse, results[2]);
      }));
    };
  }

  getSorts(): SortLabel[] {
    const sorts: SortLabel[] = [];
    this.metadata.forEach((value, key) => sorts.push({id: key, label: value.label}));
    return sorts;
  }

  setState(state: SorterState) {
    this.state.next({...state});
  }

  isEquivalent(otherState?: SorterState): Observable<boolean> {
    return this.state.pipe(map(state => {
      if (!otherState) {
        return false;
      }
      return state.sort === otherState.sort && state.reverse === otherState.reverse;
    }));
  }
}
