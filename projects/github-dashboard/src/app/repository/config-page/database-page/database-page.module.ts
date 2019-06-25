import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {DeleteConfirmationModule} from '../../shared/dialog/delete-confirmation/delete-confirmation.module';
import {HeaderContentModule} from '../../shared/header-content/header-content.module';
import {LabelListModule} from '../../shared/label-list/label-list.module';
import {LoadingModule} from '../../shared/loading/loading.module';
import {DatabasePage} from './database-page';
import {UpdateActionModule} from './type-actions/update-action.module';

const routes: Routes = [{path: '', component: DatabasePage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class DatabasePageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    LoadingModule,
    ReactiveFormsModule,
    HeaderContentModule,
    DeleteConfirmationModule,
    UpdateActionModule,
    DatabasePageRoutingModule,
    LabelListModule,
    MatTooltipModule,
  ],
  declarations: [DatabasePage],
  exports: [DatabasePage],
})
export class DatabasePageModule {
}

