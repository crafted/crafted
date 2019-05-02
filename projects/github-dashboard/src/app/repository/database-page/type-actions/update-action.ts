import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {take} from 'rxjs/operators';
import {ActiveStore} from '../../services/active-store';
import {RepoDaoType} from '../../services/dao/data-dao';
import {Updater} from '../../services/updater';

export type UpdateState = 'not-updating'|'updating'|'updated';

@Component({
  selector: 'update-action',
  styleUrls: ['update-action.scss'],
  templateUrl: 'update-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAction {
  @Input() type: RepoDaoType;

  updateState = new BehaviorSubject<UpdateState>('not-updating');

  constructor(private updater: Updater, private activeStore: ActiveStore) {
  }

  update() {
    this.updateState.next('updating');
    this.activeStore.data.pipe(take(1)).subscribe(dataStore => {
      this.updater.update(dataStore, this.type).then(() => this.updateState.next('updated'));
    });
  }
}
