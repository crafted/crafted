import 'hammerjs';

import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MatIconRegistry} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {environment} from '../environments/environment';

import {App} from './app';
import {CAN_AUTH, FIREBASE_CONFIG} from './firebase.config';
import {HomePage} from './home-page/home-page';
import {LoginModule} from './home-page/home-page.module';
import {LoginDialogModule} from './service/login-dialog/login-dialog.module';
import {RateLimitReachedModule} from './service/rate-limit-reached/rate-limit-reached.module';
import {effects, metaReducers, reducers} from './store';

@NgModule({
  declarations: [App],
  imports: [
    MatSnackBarModule,
    RateLimitReachedModule,
    LoginDialogModule,
    BrowserAnimationsModule,
    LoginModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 15,                       // Retains last n states
      logOnly: environment.production,  // Restrict extension to log-onlAy mode
    }),
    EffectsModule.forRoot(effects),
    RouterModule.forRoot(
        [
          {path: '', component: HomePage},
          {
            path: ':org/:name',
            loadChildren: () =>
                import('./repository/repository.module').then(m => m.RepositoryModule),
          },
        ],
        {preloadingStrategy: PreloadAllModules}),
    CAN_AUTH ? [AngularFireModule.initializeApp(FIREBASE_CONFIG), AngularFireAuthModule] : [],
  ],
  providers: [MatIconRegistry],
  bootstrap: [App]
})
export class AppModule {
}
