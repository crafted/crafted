import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DataSource, Filterer} from '@crafted/data';
import {Observable, Subject, Subscription} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {SavedFiltererState} from '../edit-widget';

interface SavedFiltererStateGroup {
  name: string;
  savedFiltererStates: SavedFiltererState[];
}

@Component({
  selector: 'filter-state-option',
  templateUrl: 'filter-state-option.html',
  styleUrls: ['../../edit-form.scss', 'filter-state-option.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: FilterStateOption, multi: true}]
})
export class FilterStateOption implements ControlValueAccessor {
  onChange = (_: any) => {};

  onTouched = () => {};

  @Input() filterer: Filterer<any, any>;

  @Input() dataSource: DataSource<any>;

  @Input() savedFiltererStates: SavedFiltererState[];

  savedFiltererStateGroups: SavedFiltererStateGroup[] = [];

  resultsCount: Observable<number>;

  private destroyed = new Subject();

  private filtererStateSubscription: Subscription;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['savedFiltererStates'] && this.savedFiltererStates) {
      this.savedFiltererStateGroups = this.getSavedFiltererStateGroups();
    }

    if (simpleChanges['filterer']) {
      if (this.filtererStateSubscription) {
        this.filtererStateSubscription.unsubscribe();
      }

      this.resultsCount =
          this.dataSource.data.pipe(this.filterer.filter(), map(items => items.length));

      this.filtererStateSubscription =
          this.filterer.state.pipe(takeUntil(this.destroyed)).subscribe(state => {
            this.onChange(state);
          });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  writeValue(value: any): void {
    if (value) {
      this.filterer.setState(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private getSavedFiltererStateGroups(): SavedFiltererStateGroup[] {
    const groupsMap = new Map<string, SavedFiltererState[]>();
    this.savedFiltererStates.forEach(savedFiltererState => {
      if (!groupsMap.has(savedFiltererState.group)) {
        groupsMap.set(savedFiltererState.group, []);
      }

      groupsMap.get(savedFiltererState.group)!.push(savedFiltererState);
    });

    const groupsList: SavedFiltererStateGroup[] = [];
    groupsMap.forEach((savedFiltererStates, name) => groupsList.push({name, savedFiltererStates}));
    return groupsList;
  }
}
