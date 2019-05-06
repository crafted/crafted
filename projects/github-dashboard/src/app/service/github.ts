import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {BehaviorSubject, EMPTY, merge, Observable, of, timer} from 'rxjs';
import {expand, filter, map, mergeMap, take, tap} from 'rxjs/operators';
import {Contributor, githubContributorToContributor} from '../github/app-types/contributor';
import {githubIssueToIssue, Item} from '../github/app-types/item';
import {githubLabelToLabel, Label} from '../github/app-types/label';
import {GithubComment} from '../github/github-types/comment';
import {GithubContributor} from '../github/github-types/contributor';
import {Gist} from '../github/github-types/gist';
import {GithubIssue} from '../github/github-types/issue';
import {GithubLabel} from '../github/github-types/label';
import {GithubRateLimit, GithubRateLimitResponse} from '../github/github-types/rate-limit';
import {GithubTimelineEvent} from '../github/github-types/timeline';
import {Auth} from './auth';
import {RateLimitReached} from './rate-limit-reached/rate-limit.reached';

export interface CombinedPagedResults<T> {
  total: number;
  current: T[];
  accumulated: T[];
  completed: number;
}

type RateLimitType = 'core'|'search';

const GIST_DESCRIPTION = 'Dashboard Config';

interface RateLimits {
  core: GithubRateLimit;
  search: GithubRateLimit;
}

@Injectable({providedIn: 'root'})
export class Github {
  rateLimits = new BehaviorSubject<RateLimits|null>(null);

  rateLimitMessageOpen = false;

  constructor(private http: HttpClient, private auth: Auth, private snackbar: MatSnackBar) {
    this.getRateLimitsAndScopes();
  }

  getItemsCount(repo: string, since?: string): Observable<number> {
    let query = `q=repo:${repo}`;
    if (since) {
      query += ` updated:>${since}`;
    }
    const url = this.constructUrl('search/issues', query);
    return this.get(url, false, 'search')
        .pipe(filter(v => !!v), map(result => (result.body as any).total_count));
  }

  getIssues(repo: string, since?: string): Observable<CombinedPagedResults<Item>> {
    const query = since ? `per_page=100&state=all&since=${since}` : 'per_page=100&state=all';
    const url = this.constructUrl(`repos/${repo}/issues`, query);
    return this.getPagedResults<GithubIssue, Item>(url, githubIssueToIssue);
  }

  getLabels(repo: string): Observable<CombinedPagedResults<Label>> {
    const url = this.constructUrl(`repos/${repo}/labels`, `per_page=100`);
    return this.getPagedResults<GithubLabel, Label>(url, githubLabelToLabel);
  }

  getTimeline(repo: string, id: string): Observable<CombinedPagedResults<TimelineEvent>> {
    const url = this.constructUrl(`repos/${repo}/issues/${id}/events`, 'per_page=100');
    return this.getPagedResults<GithubTimelineEvent, TimelineEvent>(
        url, githubTimelineEventtoTimelineEvent);
  }

  getContributors(repo: string): Observable<CombinedPagedResults<Contributor>> {
    const url = this.constructUrl(`repos/${repo}/contributors`, `per_page=100`);
    return this.getPagedResults<GithubContributor, Contributor>(
        url, githubContributorToContributor);
  }

  getComments(repo: string, id: string): Observable<CombinedPagedResults<UserComment>> {
    const url = this.constructUrl(`repos/${repo}/issues/${id}/comments`, 'per_page=100');
    return this.getPagedResults<GithubComment, UserComment>(url, githubCommentToUserComment);
  }

  getGists(): Observable<CombinedPagedResults<Gist>> {
    if (!this.auth.hasScope('gist')) {
      return of({total: 0, completed: 0, current: [], accumulated: []});
    }

    const url = this.constructUrl(`gists`, `per_page=100`);
    return this.getPagedResults<Gist, Gist>(url, g => g, true);
  }

  getMostPopularRepos(): Observable<string|null> {
    const url =
        this.constructUrl('search/repositories', 'q=language:typescript&sort=stars&order=desc');
    return this.get<any>(url).pipe(
        filter(v => !!v && v.body && v.body.items),
        map(response => response.body.items.map((item: any) => item.full_name)));
  }

  getRateLimitsAndScopes(): void {
    const url = this.constructUrl(`rate_limit`);
    const token = this.auth.token ? `token ${this.auth.token}` : '';
    this.http
        .get<GithubRateLimitResponse>(
            url, {observe: 'response', headers: new HttpHeaders({Authorization: token})})
        .pipe(
            filter(v => !!v), tap(response => this.updateScopes(response)), filter(v => !!v.body),
            map(result => {
              const resources = result.body.resources;
              return {
                core: resources.core,
                search: resources.search,
              };
            }),
            take(1))
        .subscribe(v => this.rateLimits.next(v));
  }

  getGist(id: string): Observable<Gist|null> {
    const url = this.constructUrl(`gists/${id}`);
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
    if (!this.auth.hasScope('gist')) {
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
  }

  editGist(id: string, filename: string, content: string) {
    if (!this.auth.hasScope('gist')) {
      return of(null);
    }

    filename = filename.replace('/', '_');

    const files: {[key in string]: {filename: string, content: string}} = {};
    files[filename] = {filename, content};
    const url = this.constructUrl(`gists/${id}`, 'random=' + Math.random());
    return this.patch(url, {files});
  }

  createDashboardGist(): Observable<Gist|null> {
    if (!this.auth.hasScope('gist')) {
      return of(null);
    }

    const url = 'https://api.github.com/gists';
    const body = {
      files: {dashboardConfig: {content: '{}'}},
      description: 'Dashboard Config',
      public: false,
    };

    return this.post<Gist>(url, body, true).pipe(filter(v => !!v), map(response => response.body));
  }

  addLabel(repo: string, issue: string, label: string): Observable<HttpResponse<any>|null> {
    const url = this.constructUrl(`repos/${repo}/issues/${issue}/labels`);
    return this.post(url, {labels: [label]});
  }

  addAssignee(repo: string, issue: string, assignee: string): Observable<HttpResponse<any>|null> {
    const url = this.constructUrl(`repos/${repo}/issues/${issue}/assignees`);
    return this.post(url, {assignees: [assignee]});
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

  private constructUrl(path: string, query = '', avoidCache = true) {
    const domain = 'https://api.github.com';
    return `${domain}/${path}?${query}${avoidCache ? '&' + new Date().toISOString() : ''}`;
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

  private post<T>(url: string, body: any, needsAuth = true, rateLimitType: RateLimitType = 'core'):
      Observable<HttpResponse<T>|null> {
    if (needsAuth && !this.auth.token) {
      return of(null);
    }

    return this.waitForRateLimit(rateLimitType)
        .pipe(
            mergeMap(() => this.http.post<T>(url, body, {
              observe: 'response',
              headers: new HttpHeaders({
                Authorization: this.auth.token ? `token ${this.auth.token}` : '',
              })
            })),
            tap(response => this.updateRateLimit(rateLimitType, response)),
            tap(response => this.updateScopes(response)));
  }

  private patch<T>(url: string, body: any, needsAuth = true, rateLimitType: RateLimitType = 'core'):
      Observable<HttpResponse<T>|null> {
    if (needsAuth && !this.auth.token) {
      return of(null);
    }

    return this.waitForRateLimit(rateLimitType)
        .pipe(
            mergeMap(() => this.http.patch<T>(url, body, {
              observe: 'response',
              headers: new HttpHeaders({
                Authorization: this.auth.token ? `token ${this.auth.token}` : '',
              })
            })),
            tap(response => this.updateRateLimit(rateLimitType, response)),
            tap(response => this.updateScopes(response)));
  }

  private get<T>(url: string, needsAuth = false, rateLimitType: RateLimitType = 'core'):
      Observable<HttpResponse<T>|null> {
    if (needsAuth && !this.auth.token) {
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
                Authorization: this.auth.token ? `token ${this.auth.token}` : '',
                Accept: accept,
              })
            })),
            tap(response => this.updateRateLimit(rateLimitType, response)),
            tap(response => this.updateScopes(response)));
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

            return merge(this.auth.token$.pipe(filter(v => !!v)), timer(refreshedDate));
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
    this.auth.scopes = response.headers.get('X-OAuth-Scopes') || '';
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
