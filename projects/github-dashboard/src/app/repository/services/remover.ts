import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {LoadedRepos} from '../../service/loaded-repos';
import {DeleteConfirmation} from '../shared/dialog/delete-confirmation/delete-confirmation';
import {ConfigDaoType, ConfigStore} from './dao/config/config-dao';
import {DataStore, RepoDaoType} from './dao/data-dao';

@Injectable()
export class Remover {
  constructor(
      private loadedRepos: LoadedRepos, private dialog: MatDialog, private snackbar: MatSnackBar) {}

  removeData(store: DataStore, type: RepoDaoType) {
    this.dialog.open(DeleteConfirmation, {data: {name: of(`${type} data for ${store.name}`)}})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            store[type].removeAll();
            this.snackbar.open(`Successfully deleted ${type}`, '', {duration: 2000});
          }
        });
  }

  removeConfig(store: ConfigStore, type: ConfigDaoType) {
    this.dialog.open(DeleteConfirmation, {data: {name: of(`${type} data for ${store.name}`)}})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            store[type].removeAll();
            this.snackbar.open(`Successfully deleted ${type}`, '', {duration: 2000});
          }
        });
  }

  removeAllData(store: DataStore, showConfirmationDialog = true) {
    if (!showConfirmationDialog) {
      this.remove(store);
      return;
    }

    const name = `locally stored data for ${store.name}`;
    const data = {name: of(name)};
    this.dialog.open(DeleteConfirmation, {data})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            this.remove(store);
            this.snackbar.open(`${name} deleted`, '', {duration: 2000});
          }
        });
  }

  private remove(repoStore: DataStore) {
    [repoStore.contributors, repoStore.items, repoStore.labels].forEach(dao => dao.removeAll());
    this.loadedRepos.removeLoadedRepo(repoStore.name);
  }
}
