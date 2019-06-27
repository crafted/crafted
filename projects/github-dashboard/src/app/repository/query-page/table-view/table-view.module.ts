import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTableModule
} from '@angular/material';
import {AdvancedSearchModule, DisplayOptionsModule, RenderedViewModule} from '@crafted/components';
import {TableView} from './table-view';


@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    AdvancedSearchModule,
    DisplayOptionsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RenderedViewModule,
    MatMenuModule,
    MatPaginatorModule,
  ],
  declarations: [TableView],
  exports: [TableView],
})
export class TableViewModule {
}
