import {Injectable} from '@angular/core';
import {Dashboard} from '@crafted/components';
import {Observable, of} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {Query} from '../repository/model/query';
import {Recommendation} from '../repository/model/recommendation';
import {Github} from './github';


export interface DashboardConfig {
  useDarkTheme: boolean;
}

export interface RepoConfig {
  queries: Query[];
  dashboards: Dashboard[];
  recommendations: Recommendation[];
}

const DASHBOARD_CONFIG_FILENAME = 'dashboardConfig';

@Injectable({providedIn: 'root'})
export class Config {
  constructor(private github: Github) {}

  saveDashboardConfig(dashboardConfig: DashboardConfig) {
    this.saveToGist(DASHBOARD_CONFIG_FILENAME, dashboardConfig);
  }

  getDashboardConfig(): Observable<DashboardConfig|null> {
    return this.syncFromGist<DashboardConfig>(DASHBOARD_CONFIG_FILENAME);
  }

  saveRepoConfigToGist(repository: string, repoConfig: RepoConfig): Promise<void> {
    return this.saveToGist(repository, repoConfig);
  }

  getRepoConfig(repository: string): Observable<RepoConfig|null> {
    return this.syncFromGist<RepoConfig>(repository);
  }

  private saveToGist(filename: string, content: DashboardConfig|RepoConfig): Promise<void> {
    return new Promise(resolve => {
      this.github.getDashboardGist()
          .pipe(
              mergeMap(gist => gist ? of(gist) : this.github.createDashboardGist()),
              mergeMap(gist => {
                if (!gist) {
                  return of(null);
                }
                return this.github.editGist(gist.id, filename, JSON.stringify(content, null, 2));
              }),
              take(1))
          .subscribe(() => resolve());
    });
  }

  private syncFromGist<T>(filename: string): Observable<T|null> {
    return this.github.getDashboardGist().pipe(map(gist => {
      if (gist && gist.files[filename]) {
        return JSON.parse(gist.files[filename].content || '');
      } else {
        return null;
      }
    }));
  }
}
