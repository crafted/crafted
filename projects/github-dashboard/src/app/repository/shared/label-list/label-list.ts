import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Label} from '../../../github/app-types/label';
import {getBorderColor, getTextColor} from '../../../github/utility/label-colors';
import {AppState} from '../../store';
import {selectLabels} from '../../store/label/label.reducer';

interface DisplayedLabel {
  id: string;
  name: string;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
}

@Component({
  selector: 'label-list',
  styleUrls: ['label-list.scss'],
  templateUrl: 'label-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelList {
  /** Label identification either by id or name */
  @Input() labelIds: string[];

  /** Whether the labels are a selection list */
  @Input() selectable = false;

  @Input() removable = false;

  @Output() selected = new EventEmitter<{id: string, name: string}>();

  @Output() removed = new EventEmitter<{id: string, name: string}>();

  labelsMap = this.store.select(selectLabels).pipe(map(labels => {
    const labelsMap = new Map<string, DisplayedLabel>();
    labels.forEach(label => {
      const displayedLabel = convertLabelToDisplayedLabel(label);
      labelsMap.set(label.id, displayedLabel);
      labelsMap.set(label.name, displayedLabel);
    });
    return labelsMap;
  }));

  displayedLabels: Observable<DisplayedLabel[]>;

  constructor(private store: Store<AppState>) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.labelIds && this.labelIds) {
      this.displayedLabels = this.labelsMap.pipe(map(labelsMap => {
        const displayedLabels = this.labelIds.map(id => labelsMap.get(id)).filter(l => !!l);
        displayedLabels.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
        return displayedLabels;
      }));
    }
  }

  select(label: DisplayedLabel) {
    if (this.selectable) {
      this.selected.emit({id: label.id, name: label.name});
    }
  }

  remove(label: DisplayedLabel) {
    if (this.removable) {
      this.removed.emit({id: label.id, name: label.name});
    }
  }
}

function convertLabelToDisplayedLabel(label: Label): DisplayedLabel {
  return {
    id: label.id,
    name: label.name,
    textColor: getTextColor(label.color),
    borderColor: getBorderColor(label.color),
    backgroundColor: '#' + label.color,
  };
}
