import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatSidenavModule, MatSnackBarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {Repository} from './repository';
import {ActiveStore} from './services/active-store';
import {ConfigDao} from './services/dao/config/config-dao';
import {DataDao} from './services/dao/data-dao';
import {Header} from './services/header';
import {Markdown} from './services/markdown';
import {PageNavigator} from './services/page-navigator';
import {Remover} from './services/remover';
import {RepoGist} from './services/repo-gist';
import {Updater} from './services/updater';
import {ConfirmConfigUpdatesModule} from './shared/dialog/confirm-config-updates/confirm-config-updates.module';
import {DeleteConfirmationModule} from './shared/dialog/delete-confirmation/delete-confirmation.module';
import {HeaderModule} from './shared/header/header.module';
import {NavModule} from './shared/nav/nav.module';


const routes: Routes = [{
  path: '',
  component: Repository,
  children: [
    {
      path: 'database',
      loadChildren: './database-page/database-page.module#DatabasePageModule',
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
    {
      path: 'recommendations',
      loadChildren: './recommendations-page/recommendations-page.module#RecommendationsPageModule',
    },

    {path: '', redirectTo: 'database', pathMatch: 'full'},
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
    RepositoryRoutingModule,
    DeleteConfirmationModule,
    ConfirmConfigUpdatesModule,
  ],
  declarations: [Repository],
  exports: [Repository],
  providers: [DataDao, ConfigDao, Header, Updater, Remover, Markdown, ActiveStore, RepoGist, PageNavigator]
})
export class RepositoryModule {
}
