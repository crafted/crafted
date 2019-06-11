import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {filter, map, mergeMap, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';

import {Github} from '../../../service/github';
import {RepositoryDatabase} from '../../../service/local-database';
import {LoadedReposAdd} from '../../../store/loaded-repos/loaded-repos.action';
import {AppState} from '../../store';

interface StorageState {
  id: string;
  label: string;
  progress?: {type: 'determinate'|'indeterminate', value?: number};
}

@Component({
  selector: 'load-data',
  styleUrls: ['load-data.scss'],
  templateUrl: 'load-data.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadData {
  @Input() repository: string;

  state: StorageState|null = null;

  loadingState = false;

  loadSubscription: Subscription;

  formGroup = new FormGroup(
      {issueDateType: new FormControl('last updated since'), issueDate: new FormControl('')});

  totalLabelsCount: Observable<number>;

  totalItemsCount: Observable<number>;

  private destroyed = new Subject();

  constructor(
      private store: Store<AppState>, private snackbar: MatSnackBar, private github: Github,
      private cd: ChangeDetectorRef, private repositoryDatabase: RepositoryDatabase) {
    const lastMonth = new Date();
    lastMonth.setDate(new Date().getDate() - 30);
    this.formGroup.get('issueDate').setValue(lastMonth, {emitEvent: false});
  }

  ngOnInit() {
    this.totalLabelsCount = this.github.getLabels(this.repository)
                                .pipe(
                                    filter(result => result.completed === result.total),
                                    map(result => result.accumulated.length));

    this.totalItemsCount =
        this.formGroup.valueChanges.pipe(startWith(null))
            .pipe(switchMap(
                () => this.github.getItemsCount(this.repository, this.getIssuesDateSince())));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  load() {
    this.loadingState = true;

    const loadedData = {
      labels: [],
      contributors: [],
      items: [],
    };

    const getLabels = this.getValues(
        'labels', r => this.github.getLabels(r), values => loadedData.labels.push(...values));

    const getContributors = this.getValues(
        'contributors', r => this.github.getContributors(r),
        values => loadedData.contributors.push(...values));

    const getIssues = this.getValues(
        'issues', r => this.github.getIssues(r, this.getIssuesDateSince()),
        values => loadedData.items.push(...values));

    this.loadSubscription =
        getLabels
            .pipe(
                mergeMap(() => getContributors), mergeMap(() => getIssues),
                takeUntil(this.destroyed))
            .subscribe(() => {
              this.repositoryDatabase.update(this.repository, 'labels', loadedData.labels);
              this.repositoryDatabase.update(this.repository, 'contributors', loadedData.contributors);
              this.repositoryDatabase.update(this.repository, 'items', loadedData.items);
              this.store.dispatch(new LoadedReposAdd({repo: this.repository}));
              this.snackbar.open(`Successfully loaded data`, '', {duration: 2000});
            });
  }

  getValues(
      type: string, loadFn: (repository: string) => Observable<any>,
      saver: (values: any) => void): Observable<void> {
    return of(null).pipe(
        tap(() => {
          this.state = {
            id: 'loading',
            label: `Loading ${type}`,
            progress: {
              type: 'determinate',
              value: 0,
            }
          };
          this.cd.markForCheck();
        }),
        mergeMap(() => loadFn(this.repository)), tap(result => {
          this.state.progress.value = result.completed / result.total * 100;
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
}
