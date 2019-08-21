import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
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
