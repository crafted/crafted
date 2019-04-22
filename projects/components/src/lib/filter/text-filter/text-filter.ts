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
import {TextEquality} from '@crafted/data';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';

const Equalities: {id: TextEquality, label: string}[] = [
  {id: 'contains', label: 'contains'},
  {id: 'is', label: 'is'},
  {id: 'notContains', label: `doesn't contain`},
  {id: 'notIs', label: 'is not'},
];

@Component({
  selector: 'text-filter',
  templateUrl: 'text-filter.html',
  styleUrls: ['text-filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFilter implements AfterViewInit, OnChanges {
  equalities = Equalities;

  form = new FormGroup({
    equality: new FormControl(''),
    value: new FormControl(''),
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

  @Input() value: string;

  @Input() equality: TextEquality;

  @Output() changed = new EventEmitter<{value: string, equality: TextEquality}>();

  private destroyed = new Subject();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.changed.next(value));

    const inputChanges = this.form.valueChanges.pipe(startWith(null), debounceTime(100));
    this.filteredOptions = combineLatest(this._options, inputChanges).pipe(map(result => {
      const options = result[0];
      const value = this.form.value.value as string;

      return options.filter(o => o.toLowerCase().includes(value.toLowerCase())).sort();
    }));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['value']) {
      this.form.get('value')!.setValue(this.value, {emitEvent: false});
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
