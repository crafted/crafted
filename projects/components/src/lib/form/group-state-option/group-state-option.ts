import {ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import {Grouper, GrouperState, GroupLabel} from '@crafted/data';

@Component({
  selector: 'group-state-option',
  templateUrl: 'group-state-option.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: GroupStateOption, multi: true}]
})
export class GroupStateOption implements ControlValueAccessor {
  groups: GroupLabel[] = [];

  @ViewChild('groupSelect', { static: true }) groupSelect: MatSelect;

  @Input() label: string;

  @Input() grouper: Grouper<any, any>;

  @Input() placeholder: string;

  @Input() type: number;

  onChange: (...args: any) => any = () => {};

  onTouched = () => {};

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.grouper && this.grouper) {
      this.groups = this.grouper.getGroups();
      this.groupSelect.value = this.groups[0].id;
    }
  }

  writeValue(value: GrouperState): void {
    if (value) {
      this.groupSelect.value = value.group;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.groupSelect.disabled = isDisabled;
  }
}
