import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
import {DeleteConfirmation} from '../shared/dialog/delete-confirmation/delete-confirmation';
import {RepoState} from './active-store';

@Injectable()
export class Remover {
  constructor(
      private loadedRepos: LoadedRepos, private dialog: MatDialog, private snackbar: MatSnackBar) {}

  removeAllData(repoState: RepoState, showConfirmationDialog = true) {
    if (!showConfirmationDialog) {
      this.remove(repoState);
      return;
    }

    const name = `locally stored data for ${repoState.repository}`;
    const data = {name: of(name)};
    this.dialog.open(DeleteConfirmation, {data})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            this.remove(repoState);
            this.snackbar.open(`${name} deleted`, '', {duration: 2000});
          }
        });
  }

  private remove(repoState: RepoState) {
    [repoState.contributorsDao, repoState.itemsDao, repoState.labelsDao].forEach(dao => dao.removeAll());
    this.loadedRepos.removeLoadedRepo(repoState.repository);
  }
}
