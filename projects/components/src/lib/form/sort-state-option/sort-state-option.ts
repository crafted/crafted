import {ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import {Sorter, SorterState, SortLabel} from '@crafted/data';

@Component({
  selector: 'sort-state-option',
  templateUrl: 'sort-state-option.html',
  styleUrls: ['sort-state-option.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SortStateOption, multi: true}]
})
export class SortStateOption implements ControlValueAccessor {
  sorts: SortLabel[] = [];

  @ViewChild('sortIdSelect', { static: true }) sortId: MatSelect;

  @ViewChild('sortDirSelect', { static: true }) sortDir: MatSelect;

  @Input() label: string;

  @Input() sorter: Sorter;

  @Input() placeholder: string;

  @Input() type: number;

  onChange: (...args: any) => any = () => {};

  onTouched = () => {};

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.sorter) {
      this.sorts = this.sorter.getSorts();
      this.sortId.value = this.sorts[0].id;
      this.sortDir.value = false;
    }
  }

  writeValue(value: SorterState): void {
    if (value) {
      this.sortId.value = value.sort;
      this.sortDir.value = value.reverse;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.sortId.disabled = isDisabled;
    this.sortDir.disabled = isDisabled;
  }
}
