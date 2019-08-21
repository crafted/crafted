import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, map, startWith, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {Github} from '../../../../service/github';
import {AppState} from '../../../store';
import {selectRepositoryName} from '../../../store/name/name.reducer';
import {dateTimeToString} from '../../time-ago/time-ago';

@Component({
  selector: 'item-title',
  styleUrls: ['item-title.scss'],
  templateUrl: 'item-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTitle {
  @Input() title: string;

  @Output() titleChanged = new EventEmitter<string>();

  titleFormControl = new FormControl();

  @ViewChild('input', { static: true }) input: ElementRef;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.title) {
      this.title = this.title.trim();
      this.titleFormControl.setValue(this.title);
    }
  }

  save() {
    this.titleFormControl.setValue(this.titleFormControl.value.trim());

    if (!this.titleFormControl.value) {
      this.titleFormControl.setValue(this.title);
    }

    if (this.titleFormControl.value !== this.title) {
      this.titleChanged.emit(this.titleFormControl.value);
    }

    this.input.nativeElement.blur();
  }

  cancel() {
    this.titleFormControl.setValue(this.title);
    this.input.nativeElement.blur();
  }
}
