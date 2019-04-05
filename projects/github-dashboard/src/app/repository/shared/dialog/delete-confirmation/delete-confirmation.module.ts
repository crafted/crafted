import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatDialogModule} from '@angular/material';
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
