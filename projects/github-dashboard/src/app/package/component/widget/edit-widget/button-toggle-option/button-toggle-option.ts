import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatButtonToggleGroup} from '@angular/material';

export interface ButtonToggleOption {
  id: string;
  label: string;
}

@Component({
  selector: 'button-toggle-group-option',
  template: `
    <div class="config-option">
      <div class="label"> {{label}} </div>
      <div class="option">
        <mat-button-toggle-group [multiple]="multiple" (change)="onChange($event.value)"
                                 #buttonToggleGroup="matButtonToggleGroup">
          <mat-button-toggle *ngFor="let option of options" [value]="option.id">
            {{option.label}}
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </div>
  `,
  styleUrls: ['../../edit-form.scss'],
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
