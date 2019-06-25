import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UpdatableType, Updater, UpdateState} from '../../../services/updater';

@Component({
  selector: 'update-action',
  styleUrls: ['update-action.scss'],
  templateUrl: 'update-action.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAction {
  @Input() type: UpdatableType;

  updateState: Observable<UpdateState>;

  constructor(private updater: Updater) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.type && this.type) {
      this.updateState = this.updater.state.pipe(map(state => state[this.type]));
    }
  }

  update() {
    this.updater.update(this.type);
  }
}
