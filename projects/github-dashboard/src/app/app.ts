import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Config} from './service/config';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'theme-text',
  }
})
export class App {
  constructor(config: Config) {
    config.syncFromDashboardConfig();
  }
}
