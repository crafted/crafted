import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';

import {LoadedReposRemove} from '../../store/loaded-repos/loaded-repos.action';
import {DeleteConfirmation} from '../shared/dialog/delete-confirmation/delete-confirmation';
import {AppState} from '../store';
import {RemoveAllContributors} from '../store/contributor/contributor.action';
import {RemoveAllItems} from '../store/item/item.action';
import {RemoveAllLabels} from '../store/label/label.action';
import {selectRepositoryName} from '../store/name/name.reducer';

@Injectable()
export class Remover {
  constructor(
      private store: Store<AppState>, private dialog: MatDialog, private router: Router,
      private snackbar: MatSnackBar) {}

  removeAllData(showConfirmationDialog = true) {
    if (!showConfirmationDialog) {
      this.remove();
      return;
    }

    this.store.select(selectRepositoryName)
        .pipe(take(1), mergeMap(repository => {
                const name = `locally stored data for ${repository}`;
                const data = {name: of(name)};
                return this.dialog.open(DeleteConfirmation, {data}).afterClosed().pipe(take(1));
              }))
        .subscribe(confirmed => {
          if (confirmed) {
            this.remove();
          }
        });
  }

  private remove() {
    this.store.dispatch(new RemoveAllItems());
    this.store.dispatch(new RemoveAllContributors());
    this.store.dispatch(new RemoveAllLabels());

    this.router.navigate(['']);

    this.store.select(selectRepositoryName).pipe(take(1)).subscribe(repo => {
      this.store.dispatch(new LoadedReposRemove({repo}));
      this.snackbar.open(`${repo} deleted`, '', {duration: 2000});
    });
  }
}
