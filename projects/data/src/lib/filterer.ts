import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Query, QueryType} from './query';

export interface Filter {
  type: string;
  query?: Query;
  isImplicit?: boolean;
}

export interface FiltererMetadata<T = any, M = any> {
  label?: string;
  queryType?: QueryType;
  queryTypeData?: any;
  matcher?: (item: T, q: Query, c: M) => boolean;
  autocomplete?: (items: T[], c: M) => string[];
}

export interface FiltererState {
  filters: Filter[];
  search: string;
}

export interface FilterOption {
  id: string;
  label: string;
}

export type FiltererContextProvider<M> = Observable<M>;

export class Filterer<T = any, M = any> {
  state = new BehaviorSubject<FiltererState>({filters: [], search: ''});

  /** Default query values to use when a new filter is added without an initial Query. */
  defaultQueries: {[key in QueryType]: Query} = {
    date: {date: '', equality: 'before'},
    input: {input: '', equality: 'contains'},
    number: {value: 0, equality: 'greaterThan'},
    state: {state: '', equality: 'is'}
  };

  /** Default and naive tokenize function that combines the item's property values into a string. */
  tokenizeItem =
      (data: T) => {
        return Object.keys(data)
            .reduce(
                (currentTerm: string, key: string) => {
                  return currentTerm + (data as {[key: string]: any})[key] + '☺';
                },
                '')
            .toLowerCase();
      }

  constructor(
      public metadata: Map<string, FiltererMetadata<T, M>>, private contextProvider?: Observable<M>,
      initialState?: FiltererState) {
    if (initialState) {
      this.state.next(initialState);
    }
  }

  /** Gets a stream that returns the items and updates whenever the filters or search changes. */
  filter(): (items: Observable<T[]>) => Observable<T[]> {
    return (items: Observable<T[]>) => {
      const contextProvider = this.contextProvider || of(() => null);
      return combineLatest(items, this.state, contextProvider).pipe(map(results => {
        const items = results[0];
        const filters = results[1].filters;
        const search = results[1].search;
        const contextProvider = results[2];

        const filteredItems = filterItems(items, filters, contextProvider, this.metadata);
        return searchItems(filteredItems, search, this.tokenizeItem);
      }));
    };
  }

  autocomplete(filtererMetadata: FiltererMetadata<T, M>):
      (items: Observable<T[]>) => Observable<string[]> {
    return (items: Observable<T[]>) => {
      return combineLatest(items, this.contextProvider).pipe(map(results => {
        if (!filtererMetadata.autocomplete) {
          return [];
        }
        return filtererMetadata.autocomplete(results[0], results[1]);
      }));
    };
  }

  setState(state: FiltererState) {
    this.state.next({...state});
  }

  isEquivalent(otherState?: FiltererState): Observable<boolean> {
    return this.state.pipe(map(state => {
      if (!otherState) {
        return false;
      }

      const filtersEquivalent =
          JSON.stringify(state.filters.sort()) === JSON.stringify(otherState.filters.sort());
      const searchEquivalent = state.search === otherState.search;

      return filtersEquivalent && searchEquivalent;
    }));
  }

  getFilterOptions(): FilterOption[] {
    const filterOptions: FilterOption[] = [];
    this.metadata.forEach((value, key) => {
      if (value.label) {
        filterOptions.push({id: key, label: value.label});
      }
    });
    return filterOptions;
  }

  add(type: string) {
    this.state.pipe(take(1)).subscribe(state => {
      const queryType = this.metadata.get(type).queryType;
      const query = this.defaultQueries[queryType];

      const filters = state.filters.slice();
      filters.push({type, query});
      this.setState({...state, filters});
    });
  }

  remove(filter: Filter) {
    this.state.pipe(take(1)).subscribe(state => {
      const filters = state.filters.slice();
      const index = state.filters.indexOf(filter);

      if (index !== -1) {
        filters.splice(index, 1);
        this.setState({...state, filters});
      }
    });
  }
}


/** Utility function to filter the items. May be used to synchronously filter items. */
export function filterItems<T, M>(
    items: T[], filters: Filter[] = [], context: M, metadata: Map<string, FiltererMetadata<T, M>>) {
  return items.filter(item => {
    return filters.every(filter => {
      if (!filter.query) {
        return true;
      }

      const filterConfig = metadata.get(filter.type);

      if (filterConfig && filterConfig.matcher) {
        return filterConfig.matcher(item, filter.query, context);
      } else {
        throw Error('Missing matcher for ' + filter.type);
      }
    });
  });
}

export function searchItems<T>(items: T[], search: string, tokenizeItem: (item: T) => string): T[] {
  return !search ? items : items.filter(item => {
    const tokens = search.split(' OR ');
    return tokens.some(token => {
      return tokenizeItem(item).indexOf(token.toLowerCase()) != -1;
    });
  });
}
