import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Item} from '../../../github/app-types/item';
import {Label} from '../../../github/app-types/label';
import {Recommendation} from '../../model/recommendation';
import {AppState} from '../../store';
import {ItemAddAssigneeAction, ItemAddLabelAction} from '../../store/item/item.action';

@Component({
  selector: 'recommendation-action',
  styleUrls: ['recommendation-action.scss'],
  templateUrl: 'recommendation-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationAction {
  @Input() item: Item;

  @Input() recommendation: Recommendation;

  constructor(private store: Store<AppState>) {}

  addLabel(label: Label) {
    this.store.dispatch(new ItemAddLabelAction({itemId: this.item.id, labelId: label.id, labelName: label.name}));
  }

  addAssignee(assignee: string) {
    this.store.dispatch(new ItemAddAssigneeAction({itemId: this.item.id, assignee}));
  }
}
