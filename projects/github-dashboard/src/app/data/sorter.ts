import {combineLatest, EMPTY, Observable, ReplaySubject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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

export interface SorterOptions<T, C> {
  metadata?: Map<string, SorterMetadata<T, C>>;
  contextProvider?: SorterContextProvider<C>;
  initialState?: SorterState;
}

export class Sorter<T = any, C = any> {
  private metadata: Map<string, SorterMetadata<T, C>>;

  private contextProvider: SorterContextProvider<C>;

  state = new ReplaySubject<SorterState>(1);

  constructor(options: SorterOptions<T, C> = {}) {
    this.metadata = options.metadata || new Map();
    this.state.next(options.initialState || {sort: this.getSorts()[0].id, reverse: false});
    this.contextProvider = options.contextProvider || EMPTY.pipe(startWith(null));
  }

  sort(): (items$: Observable<T[]>) => Observable<T[]> {
    return (items$: Observable<T[]>) => {
      return combineLatest(items$, this.state, this.contextProvider)
          .pipe(map(([items, state, context]) => {
            const sortMetadata = this.metadata.get(state.sort);
            if (!sortMetadata) {
              throw new Error(`No configuration set up for sort ${state.sort}`);
            }

            return sortItems(items, sortMetadata.comparator, state.reverse, context);
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
