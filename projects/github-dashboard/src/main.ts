import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

if (localStorage.getItem('light') === 'true') {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
