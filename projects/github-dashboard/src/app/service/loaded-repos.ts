import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export type GithubAuthScope = 'gist'|'repo';

@Injectable({providedIn: 'root'})
export class LoadedRepos {
  set repos(loadedRepos: string[]) {
    const loadedReposStr = loadedRepos.length ? loadedRepos.join(',') : '';
    window.localStorage.setItem('loadedRepos', loadedReposStr);
    this.repos$.next(loadedRepos);
  }
  get repos(): string[] {
    const loadedReposStr = window.localStorage.getItem('loadedRepos') || '';
    return loadedReposStr ? loadedReposStr.split(',') : [];
  }
  repos$ = new BehaviorSubject<string[]>(this.repos);

  isLoaded(repo: string) {
    return this.repos.indexOf(repo) !== -1;
  }

  addLoadedRepo(repo: string) {
    if (!this.isLoaded(repo)) {
      this.repos = [...this.repos, repo];
    }
  }

  removeLoadedRepo(repo: string) {
    const index = this.repos.indexOf(repo);
    const newRepos = [...this.repos];
    newRepos.splice(index, 1);
    this.repos = newRepos;
  }
}
