import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
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
    this.queryDialog.editQuery(this.query, this.activeStore.activeConfig);
  }

  deleteQuery() {
    this.queryDialog.deleteQuery(this.query, this.activeStore.activeConfig);
  }
}
