
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActiveStore} from '../../services/active-store';
import {RepoDaoType} from '../../services/dao/data-dao';
import {Remover} from '../../services/remover';
import {Updater} from '../../services/updater';

export type UpdateState = 'not-updating'|'updating'|'updated';

@Component({
  selector: 'type-actions',
  styleUrls: ['type-actions.scss'],
  templateUrl: 'type-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeActions {
  @Input() type: RepoDaoType;

  updateState = new BehaviorSubject<UpdateState>('not-updating');

  constructor(private updater: Updater, public remover: Remover, private activeRepo: ActiveStore) {}

  update() {
    this.updateState.next('updating');
    this.updater.update(this.activeRepo.activeData, this.type)
        .then(() => this.updateState.next('updated'));
  }

  remove() {
    this.remover.removeData(this.activeRepo.activeData, this.type);
  }
}
