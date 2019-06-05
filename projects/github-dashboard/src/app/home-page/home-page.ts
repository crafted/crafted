import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Router, ActivatedRoute} from '@angular/router';
import {sampleTime, switchMap, map, shareReplay} from 'rxjs/operators';
import {Github} from '../service/github';
import {LoadedRepos} from '../service/loaded-repos';

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
  popularTypescriptRepos = this.github.getMostPopularRepos();
  autocompleteControl = new FormControl('');
  autocompleteResult$ = this.autocompleteControl.valueChanges.pipe(
      sampleTime(250),
      switchMap(currentQuery => this.github.searchRepoByFullName(currentQuery.replace(/[^a-z0-9]/g, ' '))),
      map(reposList => {
        const currentQuery = this.autocompleteControl.value;
        if (!currentQuery || reposList.find(repo => repo.toUpperCase() === currentQuery.toUpperCase())) {
          return reposList;
        }
        return [currentQuery].concat(reposList.slice(0, 4));
      }),
      shareReplay(1));

  constructor(public loadedRepos: LoadedRepos, private github: Github, private router: Router, private activedRoute: ActivatedRoute) {}

  /** Navigate to the select location from the autocomplete options. */
  autocompleteSelected(event: MatAutocompleteSelectedEvent) {
    this.router.navigateByUrl(event.option.value);
  }
}
