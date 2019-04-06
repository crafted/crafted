import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {NumberEquality, NumberQuery} from '@crafted/data';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'number-query-form',
  templateUrl: 'number-query-form.html',
  styleUrls: ['number-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberQueryForm implements AfterViewInit {
  equalities: {id: NumberEquality, label: string}[] = [
    {id: 'greaterThan', label: 'greater than'},
    {id: 'equalTo', label: 'equal to'},
    {id: 'lessThan', label: 'less than'},
  ];
  form = new FormGroup({
    equality: new FormControl('greaterThan'),
    value: new FormControl(''),
  });
  destroyed = new Subject();

  @Input() focusInput: boolean;

  @Input()
  set query(query: NumberQuery) {
    this._query = query;

    if (!query) {
      return;
    }

    if (query.equality) {
      this.form.get('equality')!.setValue(query.equality, {emitEvent: false});
    }

    if (query.value) {
      this.form.get('value')!.setValue(query.value, {emitEvent: false});
    }
  }
  get query(): NumberQuery {
    return this._query;
  }
  _query: NumberQuery;

  @Output() queryChange = new EventEmitter<NumberQuery>();

  constructor(private elementRef: ElementRef, public cd: ChangeDetectorRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(value => {
      this.queryChange.next({
        equality: value.equality,
        value: value.value,
      });
    });
  }

  ngAfterViewInit() {
    const input = this.elementRef.nativeElement.querySelector('input');
    setTimeout(() => {
      if (input && this.focusInput) {
        input.focus();
      }
    }, 500);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
