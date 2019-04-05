import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface DeleteConfirmationData {
  name: Observable<string>;
  warning?: Observable<string>;
}

@Component({
  templateUrl: 'delete-confirmation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .warning {
      font-weight: bold;
      margin: 8px 0;
    }
  `]
})
export class DeleteConfirmation {
  name = this.data.name;
  warning = this.data.warning;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationData) {}
}
