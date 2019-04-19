import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatDatepickerInput} from '@angular/material';

@Component({
  selector: 'date-option',
  templateUrl: 'date-option.html',
  styleUrls: ['../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: DateOption, multi: true}]
})
export class DateOption implements ControlValueAccessor {
  onChange = (_: any) => {};

  onTouched = () => {};

  @ViewChild(MatDatepickerInput) input: MatDatepickerInput<any>;

  @Input() label: string;

  @Input() placeholder: string;

  writeValue(value: any): void {
    this.input.value = value == null ? '' : value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.input.disabled = isDisabled;
  }
}
