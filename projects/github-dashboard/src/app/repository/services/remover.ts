import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';

import {LoadedRepos} from '../../service/loaded-repos';
import {AppState} from '../../store';
import {RemoveAllContributors} from '../../store/contributor/contributor.action';
import {RemoveAllItems} from '../../store/item/item.action';
import {DeleteConfirmation} from '../shared/dialog/delete-confirmation/delete-confirmation';

import {RepoState} from './active-store';

@Injectable()
export class Remover {
  constructor(
      private store: Store<AppState>, private loadedRepos: LoadedRepos, private dialog: MatDialog,
      private snackbar: MatSnackBar) {}

  removeAllData(repoState: RepoState, showConfirmationDialog = true) {
    if (!showConfirmationDialog) {
      this.remove(repoState);
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
            this.remove(repoState);
            this.snackbar.open(`${name} deleted`, '', {duration: 2000});
          }
        });
  }

  private remove(repoState: RepoState) {
    this.store.dispatch(new RemoveAllItems());
    this.store.dispatch(new RemoveAllContributors());
    repoState.labelsDao.removeAll();

    // TODO: Removing loaded repo should be a dispatched action
    this.store.select(state => state.repository.name).pipe(take(1)).subscribe(repository => {
      this.loadedRepos.removeLoadedRepo(repository);
    });
  }
}
