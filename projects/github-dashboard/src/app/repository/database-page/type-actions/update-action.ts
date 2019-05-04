import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {ActiveStore} from '../../services/active-store';
import {UpdatableType, Updater, UpdateState} from '../../services/updater';

@Component({
  selector: 'update-action',
  styleUrls: ['update-action.scss'],
  templateUrl: 'update-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAction {
  @Input() type: UpdatableType;

  updateState: Observable<UpdateState>;

  constructor(private updater: Updater, private activeStore: ActiveStore) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.type && this.type) {
      this.updateState = this.updater.state.pipe(tap(console.log), map(state => state[this.type]));
    }
  }

  update() {
    this.activeStore.state.pipe(take(1)).subscribe(state => this.updater.update(state, this.type));
  }
}
