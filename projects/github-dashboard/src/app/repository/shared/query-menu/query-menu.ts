import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {take} from 'rxjs/operators';
import {ActiveStore} from '../../services/active-store';
import {Query} from '../../services/dao/config/query';
import {QueryDialog} from '../dialog/query/query-dialog';

@Component({
  selector: 'query-menu',
  templateUrl: 'query-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryMenu {
  @Input() query: Query;

  @Input() icon: 'settings'|'more_vert';

  constructor(private queryDialog: QueryDialog, private activeStore: ActiveStore) {
  }

  openEditNameDialog() {
    this.activeStore.config.pipe(take(1)).subscribe(configStore => {
      this.queryDialog.editQuery(this.query, configStore);
    });
  }

  deleteQuery() {
    this.activeStore.config.pipe(take(1)).subscribe(configStore => {
      this.queryDialog.deleteQuery(this.query, configStore);
    });
  }
}
