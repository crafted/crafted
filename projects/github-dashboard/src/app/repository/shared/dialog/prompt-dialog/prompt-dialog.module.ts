import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatFormFieldModule} from '@angular/material';
import {PromptDialog} from './prompt-dialog';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  declarations: [PromptDialog],
  exports: [PromptDialog],
  entryComponents: [PromptDialog]
})
export class PromptDialogModule {
}
