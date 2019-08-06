import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule, MatIconModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {LoadRepository} from './load-repository';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  declarations: [LoadRepository],
  exports: [LoadRepository],
  entryComponents: [LoadRepository]
})
export class LoadRepositoryModule {
}
