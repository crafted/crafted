import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {QueryEditModule} from '../shared/dialog/query/query-edit/query-edit.module';
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
    PortalModule,
    QueryEditModule,
    QueryMenuModule,
  ],
  declarations: [QueriesPage],
  exports: [QueriesPage],
})
export class QueriesPageModule {
}
