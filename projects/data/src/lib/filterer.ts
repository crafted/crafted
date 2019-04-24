import {combineLatest, EMPTY, Observable, ReplaySubject} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import {
  DateFilter,
  Filter,
  FilterType,
  NumberFilter,
  StateFilter,
  TextFilter
} from './filterer-types';

export type TextFilterAutocomplete<T = any, C = any> = (items: T[], c: C) => string[];

export interface TextFiltererMetadata<T = any, C = any> {
  label: string;
  type: 'text';
  matcher: (item: T, q: TextFilter, c: C) => boolean;
  autocomplete?: TextFilterAutocomplete<T, C>;
}

export interface NumberFiltererMetadata<T = any, C = any> {
  label: string;
  type: 'number';
  matcher: (item: T, q: NumberFilter, c: C) => boolean;
}

export interface DateFiltererMetadata<T = any, C = any> {
  label: string;
  type: 'date';
  matcher: (item: T, q: DateFilter, c: C) => boolean;
}

export interface StateFiltererMetadata<T = any, C = any> {
  label: string;
  type: 'state';
  matcher: (item: T, q: StateFilter, c: C) => boolean;
  states: string[];
}

export type FiltererMetadata<T = any, C = any> = TextFiltererMetadata<T, C>|
    NumberFiltererMetadata<T, C>|DateFiltererMetadata<T, C>|StateFiltererMetadata<T, C>;

export interface FiltererState {
  filters: Filter[];
  search: string;
}

export interface FilterOption {
  id: string;
  label: string;
  type: FilterType;
}

export type FiltererContextProvider<M> = Observable<M>;

export interface FiltererOptions<T, C> {
  metadata?: Map<string, FiltererMetadata<T, C>>;
  contextProvider?: FiltererContextProvider<C>;
  initialState?: FiltererState;
  tokenizeItem?: (item: T) => string;
}

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
    };

export class Filterer<T = any, C = any> {
  private readonly metadata: Map<string, FiltererMetadata<T, C>>;

  private contextProvider: Observable<C>;

  private readonly tokenizeItem: (item: T) => string;

  state = new ReplaySubject<FiltererState>(1);

  constructor(options: FiltererOptions<T, C> = {}) {
    this.metadata = options.metadata || new Map();
    this.state.next(options.initialState || {filters: [], search: ''});
    this.contextProvider = options.contextProvider || EMPTY.pipe(startWith(null));
    this.tokenizeItem = options.tokenizeItem || DEFAULT_TOKENIZE_ITEM;
  }

  /** Gets a stream that returns the items and updates whenever the filters or search changes. */
  filter(): (items: Observable<T[]>) => Observable<T[]> {
    return (items$: Observable<T[]>) => {
      return combineLatest(items$, this.state, this.contextProvider).pipe(map(results => {
        const items = results[0];
        const filters = results[1].filters;
        const search = results[1].search;
        const contextProvider = results[2];

        const filteredItems = filterItems(items, filters, contextProvider, this.metadata);
        return searchItems(filteredItems, search, this.tokenizeItem);
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
      filterOptions.push({id: key, label: value.label, type: value.type});
    });
    return filterOptions;
  }

  getStateFilterOptions(id: string): string[] {
    const filtererMetadata = this.metadata.get(id);

    if (filtererMetadata.type !== 'state') {
      throw Error(`Cannot get state options for filters with type ${filtererMetadata.type}`);
    }

    return filtererMetadata.states;
  }

  transformTextFilterOptions(id: string): (items: Observable<T[]>) => Observable<string[]> {
    const filtererMetadata = this.metadata.get(id);

    if (filtererMetadata.type !== 'text') {
      throw Error(`Cannot get text options for filters with type ${filtererMetadata.type}`);
    }

    return (items: Observable<T[]>) => {
      return combineLatest(items, this.contextProvider).pipe(map(results => {
        if (!filtererMetadata.autocomplete) {
          return [];
        }
        return filtererMetadata.autocomplete(results[0], results[1]);
      }));
    };
  }

  add(filter: Filter) {
    this.state.pipe(take(1)).subscribe(state => {
      const filters = state.filters.slice();
      filters.push(filter);
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
      const filterMetadata = metadata.get(filter.id);
      if (!filterMetadata || !filterMetadata.matcher) {
        throw Error('Missing matcher for ' + filter.id);
      }

      switch (filterMetadata.type) {
        case 'text':
          return filterMetadata.matcher(item, filter as TextFilter, context);
        case 'date':
          return filterMetadata.matcher(item, filter as DateFilter, context);
        case 'number':
          return filterMetadata.matcher(item, filter as NumberFilter, context);
        case 'state':
          return filterMetadata.matcher(item, filter as StateFilter, context);
      }
    });
  });
}

export function searchItems<T>(items: T[], search: string, tokenizeItem: (item: T) => string): T[] {
  return !search ? items : items.filter(item => {
    const tokens = search.split(' OR ');
    return tokens.some(token => {
      return tokenizeItem(item).indexOf(token.toLowerCase()) !== -1;
    });
  });
}
