import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DateEquality, DateQuery} from '@crafted/data';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'date-query-form',
  templateUrl: 'date-query-form.html',
  styleUrls: ['date-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateQueryForm {
  equalities: {id: DateEquality, label: string}[] = [
    {id: 'before', label: 'before'},
    {id: 'on', label: 'on'},
    {id: 'after', label: 'after'},
  ];
  form = new FormGroup({equality: new FormControl('on'), date: new FormControl('')});
  destroyed = new Subject();

  @Input()
  set query(query: DateQuery) {
    this._query = query;

    if (!query) {
      return;
    }

    if (query.equality) {
      this.form.get('equality')!.setValue(query.equality, {emitEvent: false});
    }

    if (query.date) {
      this.form.get('date')!.setValue(new Date(query.date), {emitEvent: false});
    }
  }
  get query(): DateQuery {
    return this._query;
  }
  _query: DateQuery;

  @Input() focusInput: boolean;

  @Output() queryChange = new EventEmitter<DateQuery>();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => this.emit());
  }

  isMobile(): boolean {
    return window.matchMedia('(max-width: 700px)').matches;
  }

  emit() {
    // Check if the input still has focus. If so, do not save.
    const input = this.elementRef.nativeElement.querySelector('input');
    if (document.activeElement == input || !input.value) {
      return;
    }

    const value = this.form.value;
    this.queryChange.next({
      equality: value.equality,
      date: value.date ? value.date.toISOString() : '',
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
