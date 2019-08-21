import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import {RouterModule, Routes} from '@angular/router';
import {HeaderContentModule} from '../shared/header-content/header-content.module';
import {ConfigPage} from './config-page';

const routes: Routes = [{
  path: '',
  component: ConfigPage,
  children: [
    {
      path: 'database',
      loadChildren: () => import('./database-page/database-page.module').then(m => m.DatabasePageModule),
    },
    {
      path: 'recommendations',
      loadChildren: () => import('./recommendations-page/recommendations-page.module').then(m => m.RecommendationsPageModule),
    },
    {path: '', redirectTo: 'database', pathMatch: 'full'},
  ],
}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ConfigPageRoutingModule {
}

@NgModule({
  imports: [
    CommonModule,
    HeaderContentModule,
    MatListModule,
    ConfigPageRoutingModule,
    MatTabsModule,
  ],
  declarations: [ConfigPage],
  exports: [ConfigPage],
})
export class ConfigPageModule {
}
