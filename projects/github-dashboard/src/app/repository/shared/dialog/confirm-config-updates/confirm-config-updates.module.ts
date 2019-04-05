import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {ConfirmConfigUpdates} from './confirm-config-updates';


@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [ConfirmConfigUpdates],
  exports: [ConfirmConfigUpdates],
  entryComponents: [ConfirmConfigUpdates]
})
export class ConfirmConfigUpdatesModule {
}
