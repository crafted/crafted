import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {combineLatest} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {Label} from '../../../github/app-types/label';
import {Github} from '../../../service/github';
import {ActiveStore} from '../../services/active-store';
import {Recommendation} from '../../services/dao/config/recommendation';

@Component({
  selector: 'recommendation-action',
  styleUrls: ['recommendation-action.scss'],
  templateUrl: 'recommendation-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationAction {
  @Input() item: Item;

  @Input() recommendation: Recommendation;

  constructor(private github: Github, private activeStore: ActiveStore) {
  }

  addLabel(label: Label) {
    combineLatest(this.activeStore.name, this.activeStore.data).pipe(mergeMap(results => {
      const repository = results[0];
      const dataStore = results[1];

      const newItem: Item = {...this.item};
      newItem.labels = [...this.item.labels, +label.id];
      dataStore.items.update(newItem);
      return this.github.addLabel(repository, this.item.id, label.name);
    }), take(1)).subscribe();
  }

  addAssignee(assignee: string) {
    combineLatest(this.activeStore.name, this.activeStore.data).pipe(mergeMap(results => {
      const repository = results[0];
      const dataStore = results[1];

      const newItem: Item = {...this.item};
      newItem.assignees = [...this.item.assignees, assignee];
      dataStore.items.update(newItem);
      return this.github.addAssignee(repository, this.item.id, assignee);
    }), take(1)).subscribe();
  }
}
