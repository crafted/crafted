import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatListModule, MatTabsModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {HeaderContentModule} from '../shared/header-content/header-content.module';
import {ConfigPage} from './config-page';

const routes: Routes = [{
  path: '',
  component: ConfigPage,
  children: [
    {
      path: 'database',
      loadChildren: './database-page/database-page.module#DatabasePageModule',
    },
    {
      path: 'recommendations',
      loadChildren: './recommendations-page/recommendations-page.module#RecommendationsPageModule',
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
