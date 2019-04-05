import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EditableChipListOption} from '../../../editable-chip-list/editable-chip-list';
import {Viewer, ViewerState} from '../../../../data-source/viewer';

@Component({
  selector: 'view-state-option',
  template: `
    <div class="config-option">
      <div class="label"> {{label}} </div>
      <div class="option">
        <editable-chip-list [values]="views"
                            [options]="options"
                            (valuesChange)="onViewsChange($event)">
        </editable-chip-list>
      </div>
    </div>
  `,
  styleUrls: ['../../edit-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ViewStateOption, multi: true}]
})
export class ViewStateOption implements ControlValueAccessor {
  options: EditableChipListOption[] = [];

  views: string[];

  onChange = (_: any) => {};

  onTouched = () => {};

  @Input() label: string;

  @Input() viewer: Viewer<any, any, any>;

  @Input() placeholder: string;

  @Input() type: number;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['viewer']) {
      this.options = this.viewer.getViews().map(v => ({id: v.id, label: v.label}));
      this.views = this.options.map(o => o.id);
    }
  }

  writeValue(value: ViewerState<any>): void {
    if (value) {
      this.views = value.views;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onViewsChange(views: string[]) {
    this.views = views;
    this.onChange({views});
  }
}
