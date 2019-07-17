import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, map, startWith, switchMap, withLatestFrom} from 'rxjs/operators';
import {Github} from '../../../../service/github';
import {AppState} from '../../../store';
import {selectRepositoryName} from '../../../store/name/name.reducer';
import {dateTimeToString} from '../../time-ago/time-ago';

@Component({
  selector: 'item-message',
  styleUrls: ['item-message.scss'],
  templateUrl: 'item-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemMessage {
  @Input() user: string;

  @Input() dateTime: string;

  @Input() message: string;

  message$ = new ReplaySubject<string>(1);

  dateTime$ = new ReplaySubject<string>(1);

  transformedDateTime = this.dateTime$.pipe(dateTimeToString());

  messageMarkdown: Observable<SafeHtml> = this.message$.pipe(
      distinctUntilChanged(), withLatestFrom(this.store.select(selectRepositoryName)),
      switchMap(([message,
                  repository]) => this.github.getMarkdown(message, repository).pipe(startWith(''))),
      map(markdown => this.sanitizer.bypassSecurityTrustHtml(markdown)));

  constructor(
      private sanitizer: DomSanitizer, private store: Store<AppState>, private github: Github) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.message) {
      this.message$.next(this.message);
    }

    if (simpleChanges.dateTime) {
      this.dateTime$.next(this.dateTime);
    }
  }
}
