import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
      loadChildren: () => import('./config-page/config-page.module').then(m => m.ConfigPageModule),
    },
    {
      path: 'dashboards',
      loadChildren: () => import('./dashboards-page/dashboards-page.module').then(m => m.DashboardsPageModule),
    },
    {
      path: 'dashboard/:id',
      loadChildren: () => import('./dashboard-page/dashboard-page.module').then(m => m.DashboardPageModule),
    },
    {
      path: 'queries',
      loadChildren: () => import('./queries-page/queries-page.module').then(m => m.QueriesPageModule),
    },
    {
      path: 'query/:id',
      loadChildren: () => import('./query-page/query-page.module').then(m => m.QueryPageModule),
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
