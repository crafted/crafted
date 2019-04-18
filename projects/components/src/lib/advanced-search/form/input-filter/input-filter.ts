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
import {InputEquality} from '@crafted/data';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';

const Equalities: {id: InputEquality, label: string}[] = [
  {id: 'contains', label: 'contains'},
  {id: 'is', label: 'is'},
  {id: 'notContains', label: `doesn't contain`},
  {id: 'notIs', label: 'is not'},
];

@Component({
  selector: 'input-filter',
  templateUrl: 'input-filter.html',
  styleUrls: ['input-filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFilter implements AfterViewInit, OnChanges {
  equalities = Equalities;

  form = new FormGroup({
    equality: new FormControl(''),
    input: new FormControl(''),
  });

  filteredOptions: Observable<string[]>;

  @Input()
  set options(o: string[]) {
    this._options.next(Array.from(new Set(o)));
  }
  get options(): string[] {
    return this._options.value;
  }
  _options = new BehaviorSubject<string[]>([]);

  @Input() focusInput: boolean;

  @Input() input: string;

  @Input() equality: InputEquality;

  @Output() changed = new EventEmitter<{input: string, equality: InputEquality}>();

  private destroyed = new Subject();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.changed.next(value));

    const inputChanges = this.form.valueChanges.pipe(startWith(null), debounceTime(100));
    this.filteredOptions = combineLatest(this._options, inputChanges).pipe(map(result => {
      const options = result[0];
      const input = this.form.value.input as string;

      return options.filter(o => o.toLowerCase().includes(input.toLowerCase())).sort();
    }));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['input']) {
      this.form.get('input')!.setValue(this.input, {emitEvent: false});
    }

    if (simpleChanges['equality']) {
      this.form.get('equality')!.setValue(this.equality, {emitEvent: false});
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
