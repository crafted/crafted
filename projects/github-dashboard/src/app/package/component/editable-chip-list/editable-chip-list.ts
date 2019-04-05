import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';

export interface EditableChipListOption {
  id: string;
  label: string;
}

@Component({
  selector: 'editable-chip-list',
  styleUrls: ['editable-chip-list.scss'],
  templateUrl: 'editable-chip-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'class': 'theme-border'}
})
export class EditableChipList {
  formControl = new FormControl();

  displayedOptions: EditableChipListOption[];

  labels: Map<string, string>;

  @Input() options: EditableChipListOption[];

  @Input()
  set values(v: string[]) {
    this._values = (v || []).slice();
  }
  get values(): string[] {
    return this._values;
  }
  _values: string[] = [];

  @Output() valuesChange = new EventEmitter<string[]>();

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['options'] || simpleChanges['values']) {
      this.displayedOptions = [];
      this.labels = new Map<string, string>();

      this.options.forEach(o => {
        if (this.values.indexOf(o.id) === -1) {
          this.displayedOptions.push(o);
        }

        this.labels.set(o.id, o.label);
      });
    }
  }

  add(value: string): void {
    this.valuesChange.emit([...this.values, value]);
  }

  remove(index: number) {
    const newValues = [...this.values];
    newValues.splice(index, 1);
    this.valuesChange.emit(newValues);
  }
}
