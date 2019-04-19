import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatButtonToggleGroup} from '@angular/material';

export interface ButtonToggleOption {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'button-toggle-group-option',
  templateUrl: 'button-toggle-option.html',
  styleUrls: ['../../edit-form.scss', 'button-toggle-option.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ButtonToggleGroupOption, multi: true}]
})
export class ButtonToggleGroupOption implements ControlValueAccessor {
  onChange = (_: any) => {};

  onTouched = () => {};

  @ViewChild(MatButtonToggleGroup) buttonToggleGroup: MatButtonToggleGroup;

  @Input() label: string;

  @Input() multiple: boolean;

  @Input() options: ButtonToggleOption[];

  writeValue(value: any): void {
    this.buttonToggleGroup.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.buttonToggleGroup.disabled = isDisabled;
  }
}
