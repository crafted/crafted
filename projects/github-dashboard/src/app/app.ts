import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {take} from 'rxjs/operators';
import {Config} from './service/config';
import {AppState} from './store';
import {ThemeSet} from './store/theme/theme.action';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'theme-text',
  }
})
export class App {
  constructor(private config: Config, private store: Store<AppState>) {
    this.config.getDashboardConfig().pipe(take(1)).subscribe(dashboardConfig => {
      if (dashboardConfig) {
        this.store.dispatch(new ThemeSet({isDark: dashboardConfig.useDarkTheme}));
      }
    });
  }
}
