import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
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
