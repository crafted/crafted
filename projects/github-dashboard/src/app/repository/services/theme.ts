import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import { Config } from '../../service/config';

@Injectable()
export class Theme {
  isLight: boolean;

  constructor(private config: Config) {
    this.syncState();

    this.config.getDashboardConfig().pipe(take(1)).subscribe((dashboardConfig => {
      if (dashboardConfig && dashboardConfig.useDarkTheme && this.isLight) {
        this.toggle();
      }
    }));
  }

  toggle() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.syncState();

    localStorage.setItem('light', String(this.isLight));
    this.config.saveDashboardConfig({useDarkTheme: !this.isLight});
  }

  private syncState() {
    this.isLight = document.body.classList.contains('light-theme');
  }
}
