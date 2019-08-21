import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
