import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: 'loading.html',
  styleUrls: ['loading.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loading {
  @Input() label: string;
}
