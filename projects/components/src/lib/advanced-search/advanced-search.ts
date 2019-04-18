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
import {DataSource, Filter, Filterer, FilterOption, Query} from '@crafted/data';
import {Observable, Subject} from 'rxjs';
import {debounceTime, take, takeUntil} from 'rxjs/operators';

export const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

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

  displayedFilterOptions: FilterOption[];

  trackByIndex = (i: number) => i;

  @Input() dataSource: DataSource<any>;

  @Input() filterer: Filterer<any, any>;

  hasDisplayedFilters: boolean;

  ngOnInit() {
    const metadata = this.filterer.metadata;

    metadata.forEach((value, key) => {
      if (value.type === 'input' && value.autocomplete) {
        this.autocomplete.set(key, this.dataSource.data.pipe(this.filterer.autocomplete(value)));
      }

      if (value.type === 'state') {
        this.states.set(key, value.states);
      }
    });

    this.filterer.state.pipe(takeUntil(this.destroyed)).subscribe(state => {
      this.hasDisplayedFilters = state.filters.some(filter => !filter.isImplicit);
      this.searchFormControl.setValue(state.search, {emitEvent: false});
    });

    this.searchFormControl.valueChanges.pipe(debounceTime(100))
        .pipe(takeUntil(this.destroyed))
        .subscribe(search => {
          this.filterer.state.pipe(take(1)).subscribe(state => {
            this.filterer.setState({filters: state.filters, search});
          });
        });

    this.displayedFilterOptions =
        this.filterer.getFilterOptions().sort((a, b) => a.label < b.label ? -1 : 1);
  }

  ngAfterViewInit() {
    this.expandState = true;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addFilter(filterId: string) {
    this.focusInput = true;
    this.filterer.add(filterId);
  }

  removeFilter(filter: Filter) {
    this.filterer.remove(filter);
  }

  queryChange(index: number, query: Query) {
    this.filterer.state.pipe(take(1)).subscribe(state => {
      const filters = state.filters.slice();
      filters[index] = {...filters[index], query};

      this.filterer.setState({...state, filters});
    });
  }
}
