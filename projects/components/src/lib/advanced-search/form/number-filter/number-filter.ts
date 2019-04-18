import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {NumberEquality} from '@crafted/data';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

const Equalities: {id: NumberEquality, label: string}[] = [
  {id: 'greaterThan', label: 'greater than'},
  {id: 'equalTo', label: 'equal to'},
  {id: 'lessThan', label: 'less than'},
];

@Component({
  selector: 'number-filter',
  templateUrl: 'number-filter.html',
  styleUrls: ['number-filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFilter implements AfterViewInit {
  equalities = Equalities;

  form = new FormGroup({
    equality: new FormControl('greaterThan'),
    value: new FormControl(''),
  });

  @Input() focusInput: boolean;

  @Input() value: string;

  @Input() equality: NumberEquality;

  @Output() changed = new EventEmitter<{input: string, equality: NumberEquality}>();

  private destroyed = new Subject();

  constructor(private elementRef: ElementRef, public cd: ChangeDetectorRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.changed.next(value));
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
