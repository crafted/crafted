import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';

import {LoadedRepos} from '../../service/loaded-repos';
import {AppState} from '../../store';
import {RemoveAllContributors} from '../../store/contributor/contributor.action';
import {RemoveAllItems} from '../../store/item/item.action';
import {RemoveAllLabels} from '../../store/label/label.action';
import {DeleteConfirmation} from '../shared/dialog/delete-confirmation/delete-confirmation';

@Injectable()
export class Remover {
  constructor(
      private store: Store<AppState>, private loadedRepos: LoadedRepos, private dialog: MatDialog,
      private snackbar: MatSnackBar) {}

  removeAllData(showConfirmationDialog = true) {
    if (!showConfirmationDialog) {
      this.remove();
      return;
    }

    this.store.select(state => state.repository.name)
        .pipe(take(1), mergeMap(repository => {
                const name = `locally stored data for ${repository}`;
                const data = {name: of(name)};
                return this.dialog.open(DeleteConfirmation, {data}).afterClosed().pipe(take(1));
              }))
        .subscribe(confirmed => {
          if (confirmed) {
            this.remove();
            this.snackbar.open(`${name} deleted`, '', {duration: 2000});
          }
        });
  }

  private remove() {
    this.store.dispatch(new RemoveAllItems());
    this.store.dispatch(new RemoveAllContributors());
    this.store.dispatch(new RemoveAllLabels());

    // TODO: Removing loaded repo should be a dispatched action
    this.store.select(state => state.repository.name).pipe(take(1)).subscribe(repository => {
      this.loadedRepos.removeLoadedRepo(repository);
    });
  }
}
