import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {RouterModule, Routes} from '@angular/router';
import {ItemsListModule} from 'projects/github-dashboard/src/app/components';
import {ItemDetailDialogModule} from '../shared/dialog/item-detail-dialog/item-detail-dialog.module';
import {QueryDialogModule} from '../shared/dialog/query/query-dialog.module';
import {HeaderContentModule} from '../shared/header-content/header-content.module';
import {ItemDetailModule} from '../shared/item-detail/item-detail.module';
import {QueryMenuModule} from '../shared/query-menu/query-menu.module';
import {DragLineModule} from './drag-line/drag-line.module';
import {QueryPage} from './query-page';
import {TableViewModule} from './table-view/table-view.module';


const routes: Routes = [{
  path: '',
  component: QueryPage,
}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class QueryPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    QueryPageRoutingModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HeaderContentModule,
    ItemDetailModule,
    ItemsListModule,
    ItemDetailDialogModule,
    QueryMenuModule,
    QueryDialogModule,
    DragLineModule,
    TableViewModule,
  ],
  declarations: [QueryPage],
  exports: [QueryPage],
})
export class QueryPageModule {
}
