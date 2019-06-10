import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, sampleTime, shareReplay, switchMap} from 'rxjs/operators';

import {Github} from '../service/github';
import {AppState} from '../store';
import {selectLoadedRepos} from '../store/loaded-repos/loaded-repos.reducer';

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
      map(reposList => {
        const currentQuery = this.autocompleteControl.value;
        if (!currentQuery ||
            reposList.find(repo => repo.toUpperCase() === currentQuery.toUpperCase())) {
          return reposList;
        }
        return [currentQuery].concat(reposList.slice(0, 4));
      }),
      shareReplay(1));

  constructor(
      private store: Store<AppState>, private github: Github, private router: Router) {}

  /** Navigate to the select location from the autocomplete options. */
  autocompleteSelected(event: MatAutocompleteSelectedEvent) {
    this.router.navigateByUrl(event.option.value);
  }
}
