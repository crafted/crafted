import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {combineLatest, Observable, of} from 'rxjs';
import {filter, map, mergeMap, startWith, tap} from 'rxjs/operators';
import {Contributor} from '../../../github/app-types/contributor';
import {Item} from '../../../github/app-types/item';
import {Label} from '../../../github/app-types/label';
import {Github} from '../../../service/github';
import {LoadedRepos} from '../../../service/loaded-repos';
import {ActiveStore} from '../../services/active-store';


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
  state: StorageState|null = null;

  loadingState = false;

  formGroup = new FormGroup(
      {issueDateType: new FormControl('last updated since'), issueDate: new FormControl('')});

  totalLabelsCount = this.activeStore.data.pipe(mergeMap(
    dataStore => this.github.getLabels(dataStore.name)
      .pipe(
        filter(result => result.completed === result.total),
        map(result => result.accumulated.length))));

  totalItemCount =
    combineLatest(this.activeStore.data, this.formGroup.valueChanges.pipe(startWith(null)))
      .pipe(mergeMap(result => {
        const dataStore = result[0];
        const since = this.getIssuesDateSince();
        return this.github.getItemsCount(dataStore.name, since);
      }));

  @Output() loading = new EventEmitter<boolean>();

  constructor(
    private loadedRepos: LoadedRepos, private activeStore: ActiveStore,
    private snackbar: MatSnackBar, private github: Github, private cd: ChangeDetectorRef) {
    const lastMonth = new Date();
    lastMonth.setDate(new Date().getDate() - 30);
    this.formGroup.get('issueDate').setValue(lastMonth, {emitEvent: false});
  }

  store() {
    this.loading.emit(true);
    this.loadingState = true;

    this.activeStore.data
      .pipe(mergeMap(dataStore => {
        const getLabels = this.getValues(
          dataStore.name, 'labels', r => this.github.getLabels(r),
          (values: Label[]) => dataStore.labels.update(values));

        const getIssues = this.getValues(
          dataStore.name, 'issues', r => this.github.getIssues(r, this.getIssuesDateSince()),
          (values: Item[]) => dataStore.items.update(values));

        const getContributors = this.getValues(
          dataStore.name, 'contributor', r => this.github.getContributors(r),
          (values: Contributor[]) => dataStore.contributors.update(values));

        return getLabels.pipe(mergeMap(() => getContributors), mergeMap(() => getIssues))
          .pipe(tap(() => {
            this.loadedRepos.addLoadedRepo(dataStore.name);
          }));
      }))
      .subscribe(() => {
        this.snackbar.open(`Successfully loaded data`, '', {duration: 2000});
        this.loading.emit(false);
      });
  }

  getValues(
      repository: string, type: string, loadFn: (repository: string) => Observable<any>,
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
        mergeMap(() => loadFn(repository)), tap(result => {
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
