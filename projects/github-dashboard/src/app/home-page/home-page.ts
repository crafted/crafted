import {ChangeDetectionStrategy, Component} from '@angular/core';
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

  constructor(public loadedRepos: LoadedRepos, private github: Github) {}
}
