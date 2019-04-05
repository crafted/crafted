import {ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'input-option',
  template: `
    <div class="config-option">
      <div class="label"> {{label}} </div>
      <div class="option">
        <input class="theme-border" #input matInput
               (input)="onChange($event.target.value)"
               autocomplete="off"
               (blur)="onTouched()"
               [placeholder]="placeholder" [type]="type">
      </div>
    </div>
  `,
  styleUrls: ['../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: InputOption, multi: true}]
})
export class InputOption implements ControlValueAccessor {
  onChange = (_: any) => {};

  onTouched = () => {};

  @ViewChild('input') input: ElementRef;

  @Input() label: string;

  @Input() placeholder: string;

  @Input() type: number;

  writeValue(value: any): void {
    this.input.nativeElement.value = value == null ? '' : value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.input.nativeElement.disabled = isDisabled;
  }
}
