import {ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSelect} from '@angular/material';
import {Sorter, SorterState, SortLabel} from '@crafted/data';

@Component({
  selector: 'sort-state-option',
  template: `
    <div class="config-option">
      <div class="label"> {{label}} </div>
      <div class="option">
        <mat-select class="auto-width" #sortIdSelect="matSelect"
                    (valueChange)="onChange({sort: $event, reverse: sortDirSelect.value})">
          <mat-option *ngFor="let sort of sorts" [value]="sort.id">
            {{sort.label}}
          </mat-option>
        </mat-select>
        <mat-select class="auto-width" #sortDirSelect="matSelect"
                    (valueChange)="onChange({sort: sortIdSelect.value, reverse: $event})">
          <mat-option [value]="false"> Ascending </mat-option>
          <mat-option [value]="true"> Descending </mat-option>
        </mat-select>
      </div>
    </div>
  `,
  styleUrls: ['../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: SortStateOption, multi: true}]
})
export class SortStateOption implements ControlValueAccessor {
  sorts: SortLabel[] = [];

  onChange = (_: any) => {};

  onTouched = () => {};

  @ViewChild('sortIdSelect') sortId: MatSelect;

  @ViewChild('sortDirSelect') sortDir: MatSelect;

  @Input() label: string;

  @Input() sorter: Sorter;

  @Input() placeholder: string;

  @Input() type: number;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['sorter']) {
      this.sorts = this.sorter.getSorts();
      this.sortId.value = this.sorts[0];
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
