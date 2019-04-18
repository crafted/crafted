import {combineLatest, EMPTY, Observable, ReplaySubject} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import {DateQuery, InputQuery, NumberQuery, Query, QueryType, StateQuery} from './query';

export interface Filter {
  type: string;
  query?: InputQuery|NumberQuery|DateQuery|StateQuery;
  isImplicit?: boolean;
}

export interface InputFiltererMetadata<T = any, C = any> {
  label?: string;
  queryType: 'input';
  matcher: (item: T, q: InputQuery, c: C) => boolean;
  autocomplete: (items: T[], c: C) => string[];
}

export interface NumberFiltererMetadata<T = any, C = any> {
  label?: string;
  queryType: 'number';
  matcher: (item: T, q: NumberQuery, c: C) => boolean;
}

export interface DateFiltererMetadata<T = any, C = any> {
  label?: string;
  queryType: 'date';
  matcher: (item: T, q: DateQuery, c: C) => boolean;
}

export interface StateFiltererMetadata<T = any, C = any> {
  label?: string;
  queryType: 'state';
  matcher: (item: T, q: StateQuery, c: C) => boolean;
  states: string[];
}

export type FiltererMetadata<T = any, C = any> = InputFiltererMetadata<T, C>|
    NumberFiltererMetadata<T, C>|DateFiltererMetadata<T, C>|StateFiltererMetadata<T, C>;

export interface FiltererState {
  filters: Filter[];
  search: string;
}

export interface FilterOption {
  id: string;
  label: string;
}

export type FiltererContextProvider<M> = Observable<M>;

export interface FiltererOptions<T, C> {
  metadata?: Map<string, FiltererMetadata<T, C>>;
  contextProvider?: FiltererContextProvider<C>;
  initialState?: FiltererState;
  initialQueries?: {[key in QueryType]: Query};
  tokenizeItem?: (item: T) => string;
}

/** Default query values to use when a new filter is added without an initial Query. */
const DEFAULT_QUERIES: {[key in QueryType]: Query} = {
  date: {date: '', equality: 'before'},
  input: {input: '', equality: 'contains'},
  number: {value: 0, equality: 'greaterThan'},
  state: {state: '', equality: 'is'}
};

/** Default and naive tokenize function that combines the item's property values into a string. */
const DEFAULT_TOKENIZE_ITEM =
    (data: any) => {
      return Object.keys(data)
          .reduce(
              (currentTerm: string, key: string) => {
                return currentTerm + (data as {[key: string]: any})[key] + '☺';
              },
              '')
          .toLowerCase();
    }

export class Filterer<T = any, C = any> {
  // Can this be made private?
  public metadata: Map<string, FiltererMetadata<T, C>>;

  private contextProvider: Observable<C>;

  private defaultQueries: {[key in QueryType]: Query};

  state = new ReplaySubject<FiltererState>(1);

  private tokenizeItem: (item: T) => string;

  constructor(options: FiltererOptions<T, C> = {}) {
    this.metadata = options.metadata || new Map();
    this.state.next(options.initialState || {filters: [], search: ''});
    this.contextProvider = options.contextProvider || EMPTY.pipe(startWith(null));
    this.defaultQueries = options.initialQueries || DEFAULT_QUERIES;
    this.tokenizeItem = options.tokenizeItem || DEFAULT_TOKENIZE_ITEM;
  }

  /** Gets a stream that returns the items and updates whenever the filters or search changes. */
  filter(): (items: Observable<T[]>) => Observable<T[]> {
    return (items: Observable<T[]>) => {
      return combineLatest(items, this.state, this.contextProvider).pipe(map(results => {
        const items = results[0];
        const filters = results[1].filters;
        const search = results[1].search;
        const contextProvider = results[2];

        const filteredItems = filterItems(items, filters, contextProvider, this.metadata);
        return searchItems(filteredItems, search, this.tokenizeItem);
      }));
    };
  }

  autocomplete(filtererMetadata: InputFiltererMetadata<T, C>):
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

  add(filterType: string) {
    this.state.pipe(take(1)).subscribe(state => {
      const queryType = this.metadata.get(filterType).queryType;
      const query = this.defaultQueries[queryType];

      const filters = state.filters.slice();
      filters.push({type: filterType, query});
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
        switch (filterConfig.queryType) {
          case 'input':
            return filterConfig.matcher(item, filter.query as InputQuery, context);
          case 'date':
            return filterConfig.matcher(item, filter.query as DateQuery, context);
          case 'number':
            return filterConfig.matcher(item, filter.query as NumberQuery, context);
          case 'state':
            return filterConfig.matcher(item, filter.query as StateQuery, context);
        }
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
