import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {take} from 'rxjs/operators';
import {Query} from '../../model/query';
import {ActiveStore} from '../../services/active-store';
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
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      this.queryDialog.editQuery(this.query, repoState);
    });
  }

  deleteQuery() {
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      this.queryDialog.deleteQuery(this.query, repoState);
    });
  }
}
