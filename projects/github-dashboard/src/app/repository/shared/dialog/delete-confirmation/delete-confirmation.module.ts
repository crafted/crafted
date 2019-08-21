import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {DeleteConfirmation} from './delete-confirmation';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [DeleteConfirmation],
  exports: [DeleteConfirmation],
  entryComponents: [DeleteConfirmation]
})
export class DeleteConfirmationModule {
}
