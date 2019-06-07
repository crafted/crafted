import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../../../store';
import {RemoveQuery, UpdateQuery} from '../../../../store/query/query.action';
import {Query} from '../../../model/query';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation';
import {QueryEdit, QueryEditResult} from './query-edit/query-edit';


@Injectable()
export class QueryDialog {
  constructor(
      private dialog: MatDialog, private snackbar: MatSnackBar, private store: Store<AppState>) {}

  /** Shows the edit query dialog to change the name/group. */
  editQuery(query: Query) {
    const data = {
      name: query.name,
      group: query.group,
    };

    this.dialog.open(QueryEdit, {data}).afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        const update = {id: query.id, changes: {name: result.name, group: result.group}};
        this.store.dispatch(new UpdateQuery({update}));
      }
    });
  }

  /**
   * Shows delete query dialog. If user confirms deletion, remove the
   * query and navigate to the queries page.
   */
  deleteQuery(query: Query) {
    const data = {name: of(query.name)};

    this.dialog.open(DeleteConfirmation, {data})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            this.store.dispatch(new RemoveQuery({id: query.id}));
            this.snackbar.open(`Query "${query.name}" deleted`, '', {duration: 2000});
          }
        });
  }

  /**
   * Shows edit query dialog to enter the name/group. If user enters a
   * name, save the query and automatically navigate to the query
   * page with $key, replacing the current URL.
   */
  saveAsQuery(): Observable<QueryEditResult> {
    return this.dialog.open(QueryEdit).afterClosed();
  }
}
