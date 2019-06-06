import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Item} from '../../../github/app-types/item';
import {Label} from '../../../github/app-types/label';
import {AppState} from '../../../store';
import {ItemAddAssigneeAction, ItemAddLabelAction} from '../../../store/item/item.action';
import {Recommendation} from '../../model/recommendation';

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
    this.store.dispatch(new ItemAddLabelAction({id: this.item.id, label: label.id}));
  }

  addAssignee(assignee: string) {
    this.store.dispatch(new ItemAddAssigneeAction({id: this.item.id, assignee}));
  }
}
