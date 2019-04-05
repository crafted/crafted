import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';
import {InputEquality, InputQuery} from '../../../../data-source/query';

@Component({
  selector: 'input-query-form',
  templateUrl: 'input-query-form.html',
  styleUrls: ['input-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQueryForm implements AfterViewInit, OnChanges {
  equalities: {id: InputEquality, label: string}[] = [
    {id: 'contains', label: 'contains'},
    {id: 'is', label: 'is'},
    {id: 'notContains', label: `doesn't contain`},
    {id: 'notIs', label: 'is not'},
  ];
  form = new FormGroup({
    equality: new FormControl('contains'),
    input: new FormControl(''),
  });
  destroyed = new Subject();

  filteredOptions: Observable<string[]>;

  @Input() query: InputQuery;

  @Input()
  set options(o: string[]) {
    this._options.next(Array.from(new Set(o)));
  }
  get options(): string[] {
    return this._options.value;
  }
  _options = new BehaviorSubject<string[]>([]);

  @Input() focusInput: boolean;

  @Output() queryChange = new EventEmitter<InputQuery>();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.queryChange.next(value));

    const inputChanges = this.form.valueChanges.pipe(startWith(null), debounceTime(100));
    this.filteredOptions = combineLatest([this._options, inputChanges]).pipe(map(result => {
      const options = result[0];
      const input = this.form.value.input as string;

      return options.filter(o => o.toLowerCase().includes(input.toLowerCase())).sort();
    }));
  }

  ngOnInit() {
    this.queryChange.next(this.form.value);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.query) {
      if (this.query) {
        if (this.query.input) {
          this.form.get('input')!.setValue(this.query.input || '', {emitEvent: false});
        }
        if (this.query.equality) {
          this.form.get('equality')!.setValue(this.query.equality || '', {emitEvent: false});
        }
      }
    }
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
