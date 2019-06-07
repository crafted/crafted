import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Query} from '../../model/query';
import {QueryDialog} from '../dialog/query/query-dialog';

@Component({
  selector: 'query-menu',
  templateUrl: 'query-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryMenu {
  @Input() query: Query;

  @Input() icon: 'settings'|'more_vert';

  constructor(private queryDialog: QueryDialog) {}

  openEditNameDialog() {
    this.queryDialog.editQuery(this.query);
  }

  deleteQuery() {
    this.queryDialog.deleteQuery(this.query);
  }
}
