import {animate, style, transition, trigger} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  DataSource,
  DateEquality,
  DateFilter,
  Filter,
  Filterer,
  FilterOption,
  FilterType,
  NumberEquality,
  NumberFilter,
  StateEquality,
  StateFilter,
  TextEquality,
  TextFilter
} from '@crafted/data';
import {Observable, Subject} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';

export const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

/** Default values to use when a new filter is added. */
const DEFAULT_FILTERS: {[key in FilterType]: (id: string) => Filter} = {
  date: id => ({id, type: 'date', date: '', equality: 'before'}),
  text: id => ({id, type: 'text', value: '', equality: 'contains'}),
  number: id => ({id, type: 'number', value: 0, equality: 'greaterThan'}),
  state: id => ({id, type: 'state', state: '', equality: 'is'})
};

@Component({
  selector: 'advanced-search',
  templateUrl: 'advanced-search.html',
  styleUrls: ['advanced-search.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.has-filters]': 'hasDisplayedFilters'},
  animations: [
    trigger(
        'expand',
        [
          transition(
              'void => true',
              [
                style({height: '0', opacity: 0}),
                animate(ANIMATION_DURATION, style({height: '*', opacity: 1})),
              ]),
          transition(
              ':leave',
              [
                style({height: '*', opacity: 1}),
                animate(ANIMATION_DURATION, style({height: '0', opacity: 0})),
              ]),
        ]),
  ]
})
export class AdvancedSearch implements OnInit, AfterViewInit, OnDestroy {
  searchFormControl = new FormControl('');
  destroyed = new Subject();

  autocomplete = new Map<string, Observable<string[]>>();

  states = new Map<string, string[]>();

  focusInput = false;

  expandState = false;

  filterOptions: FilterOption[];

  trackByIndex = (i: number) => i;

  @Input() dataSource: DataSource<any>;

  @Input() filterer: Filterer<any, any>;

  hasDisplayedFilters: boolean;

  ngOnInit() {
    const metadata = this.filterer.metadata;

    metadata.forEach((value, key) => {
      if (value.type === 'text' && value.autocomplete) {
        this.autocomplete.set(key, this.dataSource.data.pipe(this.filterer.autocomplete(value)));
      }

      if (value.type === 'state') {
        this.states.set(key, value.states);
      }
    });

    this.filterer.state.pipe(takeUntil(this.destroyed)).subscribe(state => {
      this.hasDisplayedFilters = !!state.filters.length;
      this.searchFormControl.setValue(state.search, {emitEvent: false});
    });

    this.searchFormControl.valueChanges.pipe(debounceTime(100))
        .pipe(takeUntil(this.destroyed))
        .subscribe(search => {
          this.filterer.state.pipe(take(1)).subscribe(state => {
            this.filterer.setState({filters: state.filters, search});
          });
        });

    this.filterOptions =
        this.filterer.getFilterOptions().sort((a, b) => a.label < b.label ? -1 : 1);
  }

  ngAfterViewInit() {
    this.expandState = true;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addFilter(id: string, type: FilterType) {
    this.focusInput = true;
    this.filterer.add(DEFAULT_FILTERS[type](id));
  }

  removeFilter(filter: Filter) {
    this.filterer.remove(filter);
  }

  filterChange(index: number, filter: Filter) {
    this.filterer.state.pipe(take(1)).subscribe(state => {
      const filters = state.filters.slice();
      filters[index] = filter;

      this.filterer.setState({...state, filters});
    });
  }

  textFilterChanged(index: number, value: string, equality: TextEquality) {
    this.transformFilter(index, filter => ({...filter, value, equality} as TextFilter));
  }

  numberFilterChanged(index: number, value: number, equality: NumberEquality) {
    this.transformFilter(index, filter => ({...filter, value, equality} as NumberFilter));
  }

  dateFilterChanged(index: number, date: string, equality: DateEquality) {
    this.transformFilter(index, filter => ({...filter, date, equality} as DateFilter));
  }

  stateFilterChanged(index: number, state: string, equality: StateEquality) {
    this.transformFilter(index, filter => ({...filter, state, equality} as StateFilter));
  }

  private transformFilter(index: number, transform: (filter: Filter) => Filter) {
    this.filterer.state.pipe(take(1)).subscribe(filtererState => {
      const filters = filtererState.filters.slice();
      filters[index] = transform(filters[index]);
      this.filterer.setState({...filtererState, filters});
    });
  }
}
