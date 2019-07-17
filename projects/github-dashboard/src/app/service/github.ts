import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {BehaviorSubject, EMPTY, merge, Observable, of, timer} from 'rxjs';
import {catchError, expand, filter, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {Contributor, githubContributorToContributor} from '../github/app-types/contributor';
import {githubIssueToIssue, Item, ItemStatus} from '../github/app-types/item';
import {githubLabelToLabel, Label} from '../github/app-types/label';
import {GithubComment} from '../github/github-types/comment';
import {GithubContributor} from '../github/github-types/contributor';
import {Gist} from '../github/github-types/gist';
import {GithubGraphQLStatuses} from '../github/github-types/graphql-statuses';
import {GithubIssue} from '../github/github-types/issue';
import {GithubLabel} from '../github/github-types/label';
import {PermissionResponse, RepositoryPermission} from '../github/github-types/permission';
import {GithubRateLimit, GithubRateLimitResponse} from '../github/github-types/rate-limit';
import {GithubTimelineEvent} from '../github/github-types/timeline';
import {AppState} from '../store';
import {AuthUpdateScopes} from '../store/auth/auth.action';
import {selectAuthState, selectHasScope} from '../store/auth/auth.reducer';
import {RateLimitReached} from './rate-limit-reached/rate-limit.reached';

export interface CombinedPagedResults<T> {
  total: number;
  current: T[];
  accumulated: T[];
  completed: number;
}

type RateLimitType = 'core'|'search'|'graphql';

const GIST_DESCRIPTION = 'Dashboard Config';

interface RateLimits {
  core: GithubRateLimit;
  search: GithubRateLimit;
  graphql: GithubRateLimit;
}

@Injectable({providedIn: 'root'})
export class Github {
  rateLimits = new BehaviorSubject<RateLimits|null>(null);

  rateLimitMessageOpen = false;

  constructor(
      private http: HttpClient, private store: Store<AppState>, private snackbar: MatSnackBar) {
    this.getRateLimitsAndScopes();
  }

  getItemsCount(repo: string, since?: string): Observable<number> {
    let query = `q=repo:${repo}`;
    if (since) {
      query += ` updated:>${since}`;
    }
    const url = constructUrl('search/issues', query);
    return this.get(url, false, 'search')
        .pipe(filter(v => !!v), map(result => (result.body as any).total_count));
  }

  getItem(repo: string, id: string): Observable<Item> {
    const url = constructUrl(`repos/${repo}/issues/${id}`);
    return this.get<GithubIssue>(url).pipe(
        map(response => githubIssueToIssue(response.body)), switchMap(item => {
          if (item.pr) {
            return this.getPullRequestStatuses(repo, [item.id])
                .pipe(take(1), map(result => {
                        item.statuses = result.accumulated[0].statuses;
                        return item;
                      }));
          } else {
            return of(item);
          }
        }));
  }

  getRepositoryPermission(repo: string, user: string): Observable<RepositoryPermission> {
    const url = constructUrl(`repos/${repo}/collaborators/${user}/permission`);
    return this.get<PermissionResponse>(url).pipe(
        map(response => response.body.permission),
        catchError(error => of('none' as RepositoryPermission)));
  }

  getIssues(repo: string, since?: string): Observable<CombinedPagedResults<Item>> {
    const query = since ? `per_page=100&state=all&since=${since}` : 'per_page=100&state=all';
    const url = constructUrl(`repos/${repo}/issues`, query);
    return this.getPagedResults<GithubIssue, Item>(url, githubIssueToIssue);
  }

  getLabels(repo: string): Observable<CombinedPagedResults<Label>> {
    const url = constructUrl(`repos/${repo}/labels`, `per_page=100`);
    return this.getPagedResults<GithubLabel, Label>(url, githubLabelToLabel);
  }

  getTimeline(repo: string, id: string): Observable<CombinedPagedResults<TimelineEvent>> {
    const url = constructUrl(`repos/${repo}/issues/${id}/events`, 'per_page=100');
    return this.getPagedResults<GithubTimelineEvent, TimelineEvent>(
        url, githubTimelineEventtoTimelineEvent);
  }

  getContributors(repo: string): Observable<CombinedPagedResults<Contributor>> {
    const url = constructUrl(`repos/${repo}/contributors`, `per_page=100`);
    return this.getPagedResults<GithubContributor, Contributor>(
        url, githubContributorToContributor);
  }

  getComments(repo: string, id: string): Observable<CombinedPagedResults<UserComment>> {
    const url = constructUrl(`repos/${repo}/issues/${id}/comments`, 'per_page=100');
    return this.getPagedResults<GithubComment, UserComment>(url, githubCommentToUserComment);
  }

  getGists(): Observable<CombinedPagedResults<Gist>> {
    return this.store.select(selectHasScope('gist'))
        .pipe(take(1), mergeMap(hasGistScope => {
                if (!hasGistScope) {
                  return of({total: 0, completed: 0, current: [], accumulated: []});
                }

                const url = constructUrl(`gists`, `per_page=100`);
                return this.getPagedResults<Gist, Gist>(url, g => g, true);
              }));
  }

  getMostPopularRepos(): Observable<string|null> {
    const url = constructUrl('search/repositories', 'q=language:typescript&sort=stars&order=desc');
    return this.get<any>(url).pipe(
        filter(v => !!v && v.body && v.body.items),
        map(response => response.body.items.map((item: any) => item.full_name)));
  }

  searchRepoByFullName(query: string, perPage: number = 10): Observable<string[]> {
    const url = constructUrl(
        'search/repositories',
        `fork=true&order=desc&per_page=${perPage}&q=language:typescript in:name ${query}`, false);
    return this.get<any>(url).pipe(
        filter(v => !!v && v.body && v.body.items),
        map(response => response.body.items.map((item: any) => item.full_name)));
  }

  getMarkdown(text: string, context: string) {
    const url = constructUrl('markdown');
    return this.post(url, {text, mode: 'gfm', context}, false, 'core', 'text')
        .pipe(map(response => response.body));
  }

  getRateLimitsAndScopes(): void {
    const url = constructUrl(`rate_limit`);
    this.store.select(selectAuthState)
        .pipe(
            take(1), switchMap(authState => {
              const token = authState.accessToken ? `token ${authState.accessToken}` : '';
              return this.http.get<GithubRateLimitResponse>(
                  url, {observe: 'response', headers: new HttpHeaders({Authorization: token})});
            }),
            filter(v => !!v), tap(response => this.updateScopes(response)), filter(v => !!v.body),
            map(result => {
              const resources = result.body.resources;
              return {
                core: resources.core,
                search: resources.search,
                graphql: resources.graphql,
              };
            }),
            take(1))
        .subscribe(v => this.rateLimits.next(v));
  }

  getGist(id: string): Observable<Gist|null> {
    const url = constructUrl(`gists/${id}`);
    return this.get<Gist>(url, true).pipe(filter(v => !!v), map(result => {
                                            const gist = result.body;

                                            if (!gist) {
                                              return null;
                                            }

                                            // Transform keys so that understores in keys become
                                            // slashes to match repo string
                                            const transformedFiles: {[key in string]: any} = {};
                                            Object.keys(gist.files).forEach(key => {
                                              transformedFiles[key.replace('_', '/')] =
                                                  gist.files[key];
                                            });
                                            gist.files = transformedFiles;

                                            return gist;
                                          }));
  }

  getDashboardGist(): Observable<Gist|null> {
    return this.store.select(selectHasScope('gist'))
        .pipe(take(1), mergeMap(hasGistScope => {
                if (!hasGistScope) {
                  return of(null);
                }

                return this.getGists().pipe(
                    filter(result => result.completed === result.total), mergeMap(result => {
                      const gists = result.accumulated;

                      for (let i = 0; i < gists.length; i++) {
                        if (gists[i].description.indexOf(GIST_DESCRIPTION) === 0) {
                          return this.getGist(gists[i].id);
                        }
                      }

                      return of(null);
                    }));
              }));
  }

  editGist(id: string, filename: string, content: string) {
    return this.store.select(selectHasScope('gist'))
        .pipe(take(1), mergeMap(hasGistScope => {
                if (!hasGistScope) {
                  return of(null);
                }

                filename = filename.replace('/', '_');
                const files: {[key in string]: {filename: string, content: string}} = {};
                files[filename] = {filename, content};
                const url = constructUrl(`gists/${id}`, 'random=' + Math.random());
                return this.patch(url, {files});
              }));
  }

  createDashboardGist(): Observable<Gist|null> {
    return this.store.select(selectHasScope('gist'))
        .pipe(take(1), mergeMap(hasGistScope => {
                if (!hasGistScope) {
                  return of(null);
                }

                const url = 'https://api.github.com/gists';
                const body = {
                  files: {dashboardConfig: {content: '{}'}},
                  description: 'Dashboard Config',
                  public: false,
                };

                return this.post<Gist>(url, body, true)
                    .pipe(filter(v => !!v), map(response => response.body));
              }));
  }

  addLabel(repo: string, issue: string, label: string): Observable<HttpResponse<any>|null> {
    const url = constructUrl(`repos/${repo}/issues/${issue}/labels`);
    return this.post(url, {labels: [label]});
  }

  removeLabel(repo: string, issue: string, label: string): Observable<HttpResponse<any>|null> {
    const url = constructUrl(`repos/${repo}/issues/${issue}/labels/${label}`);
    return this.delete(url);
  }

  addAssignee(repo: string, issue: string, assignee: string): Observable<HttpResponse<any>|null> {
    const url = constructUrl(`repos/${repo}/issues/${issue}/assignees`);
    return this.post(url, {assignees: [assignee]});
  }

  addComment(repo: string, issue: string, body: string): Observable<HttpResponse<any>|null> {
    const url = constructUrl(`repos/${repo}/issues/${issue}/comments`);
    return this.post(url, {body});
  }

  getPullRequestStatuses(repo: string, pullRequests: string[]):
      Observable<CombinedPagedResults<{number: number, statuses: any}>> {
    const paginationSize = 25;

    let completed = 0;
    let accumulated: any[] = [];

    // The total will be at least one request
    const total = Math.ceil(pullRequests.length / paginationSize) || 1;

    return this.getPullRequestStatusesPaged(repo, pullRequests.slice(0, paginationSize))
        .pipe(
            expand(() => {
              const start = paginationSize * completed;
              const end = start + paginationSize;
              if (start <= pullRequests.length) {
                return this.getPullRequestStatusesPaged(repo, pullRequests.slice(start, end));
              } else {
                return EMPTY;
              }
            }),
            map(result => {
              completed++;
              const transformedResponse = result;
              const current = transformedResponse;
              accumulated = accumulated.concat(transformedResponse);
              return {completed, total, current, accumulated};
            }));
  }

  private getPullRequestStatusesPaged(repo: string, pullRequests: string[]):
      Observable<{number: number, statuses: ItemStatus[]}[]> {
    if (!pullRequests.length) {
      return of([]);
    }

    const url = `https://api.github.com/graphql`;
    const owner = repo.split('/')[0];
    const name = repo.split('/')[1];
    const body = getStatusGraphQLBody(owner, name, pullRequests);

    return this.post<GithubGraphQLStatuses>(url, body).pipe(map(response => {
      const result: {number: number, statuses: ItemStatus[]}[] = [];

      if (!response) {
        return result;
      }

      const data = response.body.data;
      Object.keys(data).forEach(d => {
        const status = data[d].pullRequest;

        // Return in the case where there are no commits on the pull request.
        if (!status.commits.nodes.length) {
          return;
        }

        const lastCommitStatus = status.commits.nodes[0].commit.status;
        if (lastCommitStatus) {
          const statuses: ItemStatus[] =
              lastCommitStatus.contexts.map(c => ({name: c.context, state: c.state}));
          result.push({number: status.number, statuses});
        }
      });
      return result;
    }));
  }

  private getPagedResults<T, R>(
      url: string, transform: (values: T) => R, needsAuth = false,
      rateLimitType: RateLimitType = 'core'): Observable<CombinedPagedResults<R>> {
    let completed = 0;
    let total = 0;
    let accumulated: R[] = [];

    return this.getPaged<T>(url, needsAuth, rateLimitType)
        .pipe(
            expand(
                result =>
                    result.next ? this.getPaged<T>(result.next, needsAuth, rateLimitType) : EMPTY),
            map(result => {
              completed++;
              const transformedResponse = result.response.map(transform);
              const current = transformedResponse;
              accumulated = accumulated.concat(transformedResponse);

              // Determine this on the first pass but not subsequent ones. The
              // last page will have result.numPages equal to 1 since it is
              // missing.
              if (!total) {
                total = result.numPages;
              }

              return {completed, total, current, accumulated};
            }));
  }

  private getPaged<T>(url: string, needsAuth = false, rateLimitType: RateLimitType = 'core'):
      Observable<{response: T[], next: string, numPages: number}> {
    return this.get<T[]>(url, needsAuth, rateLimitType)
        .pipe(filter(v => !!v), map(result => {
                const response = result.body || [];
                const linkMap = getLinkMap(result.headers);
                const next = linkMap.get('next') || '';

                const last = linkMap.get('last') ? +linkMap.get('last').split('&page=')[1] : 0;
                const numPages = last || 1;
                return {response, next, numPages};
              }));
  }

  private post<T>(
      url: string, body: any, needsAuth?: boolean, rateLimitType?: RateLimitType,
      responseType?: 'json'): Observable<HttpResponse<T>>;
  private post(
      url: string, body: any, needsAuth?: boolean, rateLimitType?: RateLimitType,
      responseType?: 'text'): Observable<HttpResponse<string>>;
  private post<T>(
      url: string, body: any, needsAuth = true, rateLimitType: RateLimitType = 'core',
      responseType: 'json'|'text' = 'json'): Observable<HttpResponse<T|string>|null> {
    return this.store.select(selectAuthState)
        .pipe(take(1), mergeMap(authState => {
                const token = authState.accessToken;

                if (needsAuth && !token) {
                  return of(null);
                }

                return this.waitForRateLimit(rateLimitType)
                    .pipe(
                        mergeMap<any, HttpResponse<T|string>>(
                            () => responseType === 'json' ? this.postJson<T>(url, body, token) :
                                                            this.postText(url, body, token)),
                        tap(response => this.updateRateLimit(rateLimitType, response)),
                        tap(response => this.updateScopes(response)));
              }));
  }

  private postJson<T>(url, body, token): Observable<HttpResponse<T>> {
    return this.http.post<T>(url, body, {
      observe: 'response',
      responseType: 'json',
      headers: new HttpHeaders({
        Authorization: token ? `token ${token}` : '',
      })
    });
  }


  private postText(url, body, token): Observable<HttpResponse<string>> {
    return this.http.post(url, body, {
      observe: 'response',
      responseType: 'text',
      headers: new HttpHeaders({
        Authorization: token ? `token ${token}` : '',
      })
    });
  }

  private delete<T>(url: string, needsAuth = true, rateLimitType: RateLimitType = 'core'):
      Observable<HttpResponse<T>|null> {
    return this.store.select(selectAuthState)
        .pipe(take(1), mergeMap(authState => {
                const token = authState.accessToken;

                if (needsAuth && !token) {
                  return of(null);
                }

                return this.waitForRateLimit(rateLimitType)
                    .pipe(
                        mergeMap(() => this.http.delete<T>(url, {
                          observe: 'response',
                          headers: new HttpHeaders({
                            Authorization: token ? `token ${token}` : '',
                          })
                        })),
                        tap(response => this.updateRateLimit(rateLimitType, response)),
                        tap(response => this.updateScopes(response)));
              }));
  }

  private patch<T>(url: string, body: any, needsAuth = true, rateLimitType: RateLimitType = 'core'):
      Observable<HttpResponse<T>|null> {
    return this.store.select(selectAuthState)
        .pipe(take(1), mergeMap(authState => {
                const token = authState.accessToken;

                if (needsAuth && !token) {
                  return of(null);
                }

                return this.waitForRateLimit(rateLimitType)
                    .pipe(
                        mergeMap(() => this.http.patch<T>(url, body, {
                          observe: 'response',
                          headers: new HttpHeaders({
                            Authorization: token ? `token ${token}` : '',
                          })
                        })),
                        tap(response => this.updateRateLimit(rateLimitType, response)),
                        tap(response => this.updateScopes(response)));
              }));
  }

  private get<T>(url: string, needsAuth = false, rateLimitType: RateLimitType = 'core'):
      Observable<HttpResponse<T>|null> {
    return this.store.select(selectAuthState)
        .pipe(take(1), mergeMap(authState => {
                const token = authState.accessToken;

                if (needsAuth && !token) {
                  return of(null);
                }

                const accept: string[] = [];

                // Label descriptions
                accept.push('application/vnd.github.symmetra-preview+json');

                // Issue reactions
                accept.push('application/vnd.github.squirrel-girl-preview');


                return this.waitForRateLimit(rateLimitType)
                    .pipe(
                        mergeMap(() => this.http.get<T>(url, {
                          observe: 'response',
                          headers: new HttpHeaders({
                            Authorization: token ? `token ${token}` : '',
                            Accept: accept,
                          })
                        })),
                        tap(response => this.updateRateLimit(rateLimitType, response)),
                        tap(response => this.updateScopes(response)));
              }));
  }

  private waitForRateLimit(rateLimitType: RateLimitType): Observable<any> {
    return this.rateLimits.pipe(
        filter(v => !!v), take(1), mergeMap(rateLimits => {
          const rateLimit = rateLimits[rateLimitType];
          if (!rateLimit.remaining) {
            const secondsDelay = 5;
            const refreshedDate = new Date((rateLimit.reset * 1000) + secondsDelay);

            if (!this.rateLimitMessageOpen) {
              this.snackbar
                  .openFromComponent(
                      RateLimitReached,
                      {panelClass: 'theme-background-warn', data: {reset: rateLimit.reset}})
                  .afterDismissed()
                  .pipe(take(1))
                  .subscribe(() => this.rateLimitMessageOpen = false);
              this.rateLimitMessageOpen = true;
            }

            return merge(
                this.store.select(selectAuthState)
                    .pipe(map(authState => authState.accessToken), filter(v => !!v)),
                timer(refreshedDate));
          } else {
            return of(null);
          }
        }));
  }

  private updateRateLimit(type: RateLimitType, response: HttpResponse<any>|null) {
    if (!response) {
      return;
    }

    const reset = +(response.headers.get('x-ratelimit-reset') || '0');
    const limit = +(response.headers.get('x-ratelimit-limit') || '0');
    const remaining = +(response.headers.get('x-ratelimit-remaining') || '0');
    this.rateLimits.pipe(filter(v => !!v), take(1)).subscribe(rateLimit => {
      rateLimit[type] = {reset, limit, remaining};
      this.rateLimits.next(rateLimit);
    });
  }

  private updateScopes(response: HttpResponse<any>) {
    const scopesStr = response.headers.get('X-OAuth-Scopes') || '';
    const scopes = scopesStr.split(',').map(v => v.trim());
    this.store.dispatch(new AuthUpdateScopes({scopes}));
  }
}

export interface UserComment {
  message: string;
  user: string;
  created: string;
  updated: string;
}

function githubCommentToUserComment(o: GithubComment): UserComment {
  return {
    message: o.body,
    user: o.user.login,
    created: o.created_at,
    updated: o.updated_at,
  };
}

export interface TimelineEvent {
  actor: string;
  type: string;
  created: string;
  labels: string[];
  lockReason: string;
  assignees: string[];
  assigner: string;
  dismissed_review: any;
  milestone: {title: string};
  rename: {from: string, to: string};
  requestedReviewers: any;
  reviewRequester: any;
}

function githubTimelineEventtoTimelineEvent(o: GithubTimelineEvent): TimelineEvent {
  return {
    actor: o.actor.login,
    type: o.event,
    created: o.created_at,
    labels: o.label ? [o.label.name] : o.labels ? o.labels.map(l => l.name) : [],
    lockReason: o.lock_reason,
    assignees: o.assignee ? [o.assignee.login] : o.assignees ? o.assignees.map(a => a.login) : [],
    assigner: o.assigner && o.assigner.login,
    dismissed_review: o.dismissed_review,
    milestone: o.milestone,
    rename: o.rename,
    requestedReviewers: o.requested_reviewers,
    reviewRequester: o.review_requester,
  };
}


export function getLinkMap(headers: any) {
  const links = new Map<string, string>();
  const link = headers.get('link');

  if (link) {
    link.split(',').forEach((v: string) => {
      const rawUrl = v.split(';')[0].replace('<', '').replace('>', '');
      const rawRel = v.split(';')[1].split('=')[1].replace('"', '').replace('"', '');
      links.set(rawRel, rawUrl);
    });
  }

  return links;
}

/**
 * Observable Pipe - Takes a stream of combinedPagedResults and emits the accumulated result when
 * completed.
 */
export function completedPagedResults<T>(): (results: Observable<CombinedPagedResults<T>>) =>
    Observable<T[]> {
  return (results$: Observable<CombinedPagedResults<T>>) => {
    return results$.pipe(
        filter(results => results.completed === results.total),
        map(results => results.accumulated));
  };
}

function constructUrl(path: string, query = '', avoidCache = true) {
  const domain = 'https://api.github.com';
  return `${domain}/${path}?${query}${avoidCache ? '&' + new Date().toISOString() : ''}`;
}

function getStatusGraphQLBody(owner, name, ids: string[]) {
  let requests = ``;
  ids.forEach(id => {
    requests += `
        pr${id} : repository(owner: "${owner}", name: "${name}") {
          pullRequest(number: ${id}) {
            number
            commits(last: 1) {
              nodes {
                commit {
                  status {
                    contexts {
                      context
                      state
                    }
                  }
                }
              }
            }
          }
        }
      `;
  });
  return {query: `query { ${requests} }`};
}
