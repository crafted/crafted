import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {filter, map, mergeMap, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Contributor} from '../../github/app-types/contributor';
import {Item, ItemStatus} from '../../github/app-types/item';
import {Label} from '../../github/app-types/label';
import {AppState} from '../../repository/store';
import {CombinedPagedResults, Github} from '../github';

interface StorageState {
  id: string;
  label: string;
  progress: number;
}

export interface LoadRepositoryData {
  name: string;
}

export interface LoadRepositoryResult {
  items: Item[];
  labels: Label[];
  contributors: Contributor[];
}

@Component({
  templateUrl: 'load-repository.html',
  styleUrls: ['load-repository.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadRepository {
  loadingState: StorageState|null = null;

  loadSubscription: Subscription;

  formGroup = new FormGroup(
      {issueDateType: new FormControl('last updated since'), issueDate: new FormControl('')});

  totalLabelsCount = this.github.getLabels(this.data.name)
                         .pipe(
                             filter(result => result.completed === result.total),
                             map(result => result.accumulated.length));

  totalItemsCount =
      this.formGroup.valueChanges.pipe(startWith(null))
          .pipe(switchMap(
              () => this.github.getItemsCount(this.data.name, this.getIssuesDateSince())));

  private destroyed = new Subject();

  constructor(
      private store: Store<AppState>, private github: Github, private cd: ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) public data: LoadRepositoryData,
      private dialogRef: MatDialogRef<LoadRepository, LoadRepositoryResult>) {
    const lastMonth = new Date();
    lastMonth.setDate(new Date().getDate() - 30);
    this.formGroup.get('issueDate').setValue(lastMonth, {emitEvent: false});
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  load() {
    const result: LoadRepositoryResult = {
      labels: [],
      contributors: [],
      items: [],
    };

    const getLabels = this.getValues(
        'labels', () => this.github.getLabels(this.data.name),
        values => result.labels.push(...values));

    const getContributors = this.getValues(
        'contributors', () => this.github.getContributors(this.data.name),
        values => result.contributors.push(...values));

    const getIssues = this.getValues(
        'issues', () => this.github.getIssues(this.data.name, this.getIssuesDateSince()),
        values => result.items.push(...values));

    const getStatuses = this.getValues<{number: number, statuses: ItemStatus[]}>(
        'pull request statuses', () => this.getPullRequestStatuses(result.items),
        values => {
          const statusMap = new Map<number, ItemStatus[]>();
          values.forEach(v => statusMap.set(v.number, v.statuses));
          result.items.forEach(item => {
            if (statusMap.has(item.number)) {
              console.log(item);
            }
          });
          console.log(values);
        });

    this.loadSubscription = getLabels
                                .pipe(
                                    mergeMap(() => getContributors), mergeMap(() => getIssues),
                                    mergeMap(() => getStatuses), takeUntil(this.destroyed))
                                .subscribe(() => this.dialogRef.close(result));
  }

  getValues<T = any>(
      type: string, loadFn: () => Observable<CombinedPagedResults<T>>,
      saver: (values: T[]) => void): Observable<CombinedPagedResults<T>> {
    return of(null).pipe(
        tap(() => {
          this.loadingState = {id: 'loading', label: `Loading ${type}`, progress: 0};
          this.cd.markForCheck();
        }),
        mergeMap(() => loadFn()), tap(result => {
          this.loadingState.progress = result.completed / result.total * 100;
          this.cd.markForCheck();
          saver(result.current);
        }),
        filter(result => result.completed === result.total));
  }

  private getIssuesDateSince() {
    const issueDateType = this.formGroup.value.issueDateType;
    const issueDate = this.formGroup.value.issueDate;
    let since = '';
    if (issueDateType === 'last updated since') {
      since = new Date(issueDate).toISOString().substring(0, 10);
    }

    return since;
  }

  private getPullRequestStatuses(items: Item[]): Observable<CombinedPagedResults<any>> {
    const openPullRequests =
        items.filter(item => !!item.pr).map(item => `${item.number}`);
    return this.github.getPullRequestStatuses(this.data.name, openPullRequests);
  }
}
