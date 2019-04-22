import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Viewer, ViewerState} from '@crafted/data';
import {EditableChipListOption} from '../../editable-chip-list/editable-chip-list';

@Component({
  selector: 'view-state-option',
  templateUrl: 'view-state-option.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ViewStateOption, multi: true}]
})
export class ViewStateOption implements ControlValueAccessor {
  options: EditableChipListOption[] = [];

  views: string[];

  onChange = (_: any) => {};

  onTouched = () => {};

  @Input() label: string;

  @Input() viewer: Viewer<any, any>;

  @Input() placeholder: string;

  @Input() type: number;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['viewer']) {
      this.options = this.viewer.getViews();
      this.views = this.options.map(o => o.id);
    }
  }

  writeValue(value: ViewerState): void {
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
