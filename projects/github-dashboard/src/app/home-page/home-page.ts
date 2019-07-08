import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {combineLatest, from} from 'rxjs';
import {map, sampleTime, shareReplay, switchMap, take, withLatestFrom} from 'rxjs/operators';
import {Contributor} from '../github/app-types/contributor';
import {Item} from '../github/app-types/item';
import {Label} from '../github/app-types/label';

import {Github} from '../service/github';
import {
  LoadRepository,
  LoadRepositoryData,
  LoadRepositoryResult
} from '../service/load-repository/load-repository';
import {RepositoryDatabase} from '../service/repository-database';
import {AppState} from '../store';
import {LoadedReposAdd} from '../store/loaded-repos/loaded-repos.action';
import {selectIsRepoLoaded, selectLoadedRepos} from '../store/loaded-repos/loaded-repos.reducer';

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.html',
  styleUrls: ['home-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'theme-background',
  }
})
export class HomePage {
  loadedRepos = this.store.select(selectLoadedRepos);

  hasLoadedRepos = this.loadedRepos.pipe(map(loadedRepos => loadedRepos.length));

  popularTypescriptRepos = this.github.getMostPopularRepos();
  autocompleteControl = new FormControl('');
  autocompleteResult$ = this.autocompleteControl.valueChanges.pipe(
      sampleTime(250),
      switchMap(
          currentQuery =>
              this.github.searchRepoByFullName(currentQuery.replace(/[^a-z0-9]/g, ' '))),
      withLatestFrom(this.loadedRepos), map(([reposList, loadedRepos]) => {
        const currentQuery = this.autocompleteControl.value;
        if (!currentQuery ||
            reposList.find(repo => repo.toUpperCase() === currentQuery.toUpperCase())) {
          return reposList;
        }

        loadedRepos.forEach(loadedRepo => {
          const index = reposList.indexOf(loadedRepo);
          if (index !== -1) {
            reposList.splice(index, 1);
          }
        });

        return [currentQuery].concat(reposList.slice(0, 4));
      }),
      shareReplay(1));

  constructor(
      private store: Store<AppState>, private snackbar: MatSnackBar, private github: Github,
      private router: Router, private dialog: MatDialog,
      private repositoryDatabase: RepositoryDatabase) {}

  /** Navigate to the select location from the autocomplete options. */
  autocompleteSelected(event: MatAutocompleteSelectedEvent) {
    this.open(event.option.value);
  }

  open(repository: string) {
    this.store.select(selectIsRepoLoaded(repository))
        .pipe(take(1))
        .subscribe(
            isLoaded => isLoaded ? this.router.navigate([`${repository}`]) :
                                   this.openLoadDialog(repository));
  }

  persistLoadedData(
      repository: string, items: Item[], labels: Label[], contributors: Contributor[]) {
    combineLatest(
        from(this.repositoryDatabase.update(repository, 'labels', labels)),
        from(this.repositoryDatabase.update(repository, 'contributors', contributors)),
        from(this.repositoryDatabase.update(repository, 'items', items)))
        .pipe(take(1))
        .subscribe(() => {
          this.store.dispatch(new LoadedReposAdd({repo: repository}));
          this.snackbar.open(`Successfully loaded data`, '', {duration: 2000});
          this.router.navigate([`${repository}`]);
        });
  }

  private openLoadDialog(repository: string) {
    this.dialog
        .open<LoadRepository, LoadRepositoryData, LoadRepositoryResult>(
            LoadRepository, {data: {name: repository}, width: '500px'})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            this.persistLoadedData(repository, result.items, result.labels, result.contributors);
          }
        });
  }
}
