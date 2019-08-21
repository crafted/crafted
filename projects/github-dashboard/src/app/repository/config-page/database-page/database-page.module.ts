import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
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

