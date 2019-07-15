import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatSidenavModule, MatSnackBarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {Repository} from './repository';
import {Header} from './services/header';
import {Remover} from './services/remover';
import {RepoGist} from './services/repo-gist';
import {Updater} from './services/updater';
import {ConfirmConfigUpdatesModule} from './shared/dialog/confirm-config-updates/confirm-config-updates.module';
import {DeleteConfirmationModule} from './shared/dialog/delete-confirmation/delete-confirmation.module';
import {HeaderModule} from './shared/header/header.module';
import {LoadingModule} from './shared/loading/loading.module';
import {NavModule} from './shared/nav/nav.module';
import {effects, reducers} from './store';

const routes: Routes = [{
  path: '',
  component: Repository,
  children: [
    {
      path: 'config',
      loadChildren: './config-page/config-page.module#ConfigPageModule',
    },
    {
      path: 'dashboards',
      loadChildren: './dashboards-page/dashboards-page.module#DashboardsPageModule',
    },
    {
      path: 'dashboard/:id',
      loadChildren: './dashboard-page/dashboard-page.module#DashboardPageModule',
    },
    {
      path: 'queries',
      loadChildren: './queries-page/queries-page.module#QueriesPageModule',
    },
    {
      path: 'query/:id',
      loadChildren: './query-page/query-page.module#QueryPageModule',
    },
    {path: '', redirectTo: 'queries', pathMatch: 'full'},
  ]
}];


@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class RepositoryRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatSnackBarModule,
    NavModule,
    HeaderModule,
    RouterModule,
    LoadingModule,
    RepositoryRoutingModule,
    DeleteConfirmationModule,
    ConfirmConfigUpdatesModule,
    StoreModule.forFeature('repository', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [Repository],
  exports: [Repository],
  providers: [Header, Updater, Remover, RepoGist]
})
export class RepositoryModule {
}
