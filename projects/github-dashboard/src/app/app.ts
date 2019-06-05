import {ChangeDetectionStrategy, Component} from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'theme-text',
  }
})
export class App {
}
