import {ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatSelect} from '@angular/material';
import {Grouper} from '@crafted/data';

@Component({
  selector: 'group-state-option',
  template: `
    <div class="config-option">
      <div class="label"> {{label}} </div>
      <div class="option">
        <mat-select class="theme-border" #groupSelect="matSelect"
                    [value]="group"
                    (valueChange)="onChange({group: $event})">
          <mat-option *ngFor="let groupId of groupIds" [value]="groupId">
            {{grouper.metadata.get(groupId)?.label}}
          </mat-option>
        </mat-select>
      </div>
    </div>
  `,
  styleUrls: ['../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: GroupStateOption, multi: true}]
})
export class GroupStateOption<G> implements ControlValueAccessor {
  groupIds: G[] = [];

  onChange = (_: any) => {};

  onTouched = () => {};

  @ViewChild('groupSelect') groupSelect: MatSelect;

  @Input() label: string;

  @Input() grouper: Grouper<any, G, any>;

  @Input() placeholder: string;

  @Input() type: number;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['grouper']) {
      this.groupIds = this.grouper.getGroups().map(value => value.id);
      this.groupSelect.value = this.groupIds[0];
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.groupSelect.value = value;
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
