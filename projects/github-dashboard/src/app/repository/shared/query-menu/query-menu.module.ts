import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {QueryDialogModule} from '../dialog/query/query-dialog.module';
import {QueryMenu} from './query-menu';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    QueryDialogModule,
  ],
  declarations: [QueryMenu],
  exports: [QueryMenu],
})
export class QueryMenuModule {
}
