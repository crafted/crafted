import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatDialogModule} from '@angular/material';
import {LoadDataModule} from '../../repository/database-page/load-data/load-data.module';
import {LoadRepository} from './load-repository';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadDataModule,
  ],
  declarations: [LoadRepository],
  exports: [LoadRepository],
  entryComponents: [LoadRepository]
})
export class LoadRepositoryModule {
}
