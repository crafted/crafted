import {ChangeDetectionStrategy, Component, Inject, Query} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Dashboard} from '@crafted/components';
import {Recommendation} from '../../../model/recommendation';
import {LocalToRemoteComparison} from '../../../utility/compare-local-to-remote';

export interface ConfirmConfigUpdatesData {
  dashboards: LocalToRemoteComparison<Dashboard>;
  recommendations: LocalToRemoteComparison<Recommendation>;
  queries: LocalToRemoteComparison<Query>;
}

@Component({
  templateUrl: 'confirm-config-updates.html',
  styleUrls: ['confirm-config-updates.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmConfigUpdates {
  confirmations = ['dashboards', 'queries', 'recommendations'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmConfigUpdatesData) {}
}
