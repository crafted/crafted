import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {take} from 'rxjs/operators';
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

  constructor(private github: Github, private activeRepo: ActiveStore) {}

  addLabel(label: Label) {
    const newItem: Item = {...this.item};
    newItem.labels = [...this.item.labels, +label.id];
    this.activeRepo.activeData.items.update(newItem);
    this.github.addLabel(this.activeRepo.activeName, this.item.id, label.name)
        .pipe(take(1))
        .subscribe();
  }

  addAssignee(assignee: string) {
    const newItem: Item = {...this.item};
    newItem.assignees = [...this.item.assignees, assignee];
    this.activeRepo.activeData.items.update(newItem);
    this.github.addAssignee(this.activeRepo.activeName, this.item.id, assignee)
        .pipe(take(1))
        .subscribe();
  }
}
