import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {mergeMap} from 'rxjs/operators';
import {ActiveStore} from '../../services/active-store';
import {Header} from '../../services/header';
import {isRepoStoreEmpty} from '../../utility/is-repo-store-empty';

@Component({
  selector: 'app-header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonHeader {
  isEmpty = this.activeStore.data.pipe(mergeMap(store => isRepoStoreEmpty(store)));

  @Input() sidenav: MatSidenav;

  constructor(public header: Header, private activeStore: ActiveStore) {
  }

  leftButtonClicked() {
    if (this.header.goBack) {
      window.history.back();
    } else {
      this.sidenav.open();
    }
  }
}
