import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {RouterModule, Routes} from '@angular/router';
import {CollectionPageEmptyStateModule} from '../shared/collection-page-empty-state/collection-page-empty-state.module';
import {QueryEditModule} from '../shared/dialog/query/query-edit/query-edit.module';
import {HeaderContentModule} from '../shared/header-content/header-content.module';
import {QueryMenuModule} from '../shared/query-menu/query-menu.module';
import {QueriesPage} from './queries-page';


const routes: Routes = [{path: '', component: QueriesPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class QueriesPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    QueriesPageRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    HeaderContentModule,
    MatRippleModule,
    QueryEditModule,
    QueryMenuModule,
    HeaderContentModule,
    CollectionPageEmptyStateModule,
  ],
  declarations: [QueriesPage],
  exports: [QueriesPage],
})
export class QueriesPageModule {
}
