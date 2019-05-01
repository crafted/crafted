import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {Label} from '../../../github/app-types/label';
import {getBorderColor, getTextColor} from '../../../github/utility/label-colors';
import {ActiveStore} from '../../services/active-store';

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
  @Input()
  set labelIds(labelIds: string[]) {
    this._labelIds.next(labelIds);
  }
  _labelIds = new BehaviorSubject<string[]>([]);

  /** Whether the labels are a selection list */
  @Input() selectable: boolean;

  @Output() selected = new EventEmitter<Label>();


  labels = this.activeStore.data.pipe(
      mergeMap(store => combineLatest(this._labelIds, store.labels.list)), map(result => {
        const labelIds = result[0];
        const repoLabels = result[1];

        const labelsMap = new Map<string, Label>();
        repoLabels.forEach(label => {
          labelsMap.set(label.id, label);
          labelsMap.set(label.name, label);
        });

        const labels: DisplayedLabel[] = [];
        labelIds.forEach(labelId => {
          const label = labelsMap.get(`${labelId}`);
          if (label) {  // labels may be applied but no longer exist
            labels.push(convertLabelToDisplayedLabel(label));
          }
        });
        labels.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
        return labels;
      }));

  constructor(private activeStore: ActiveStore) {
  }

  select(label: Label) {
    if (this.selectable) {
      this.selected.emit(label);
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
