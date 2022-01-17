import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DateEquality} from 'projects/github-dashboard/src/app/data';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

const EQUALITIES: {id: DateEquality, label: string}[] = [
  {id: 'before', label: 'before'},
  {id: 'on', label: 'on'},
  {id: 'after', label: 'after'},
];

@Component({
  selector: 'date-filter',
  templateUrl: 'date-filter.html',
  styleUrls: ['date-filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilter {
  equalities = EQUALITIES;

  form = new FormGroup({
    equality: new FormControl('on'),
    date: new FormControl(null),
  });

  @Input() date: string;

  @Input() equality: DateEquality;

  @Input() focusInput: boolean;

  @Output() changed = new EventEmitter<{date: string, equality: DateEquality}>();

  private destroyed = new Subject();

  constructor(private elementRef: ElementRef) {
    this.form.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => this.emit());
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.date) {
      this.form.get('date').setValue(new Date(this.date), {emitEvent: false});
    }

    if (simpleChanges.equality) {
      this.form.get('equality').setValue(this.equality, {emitEvent: false});
    }
  }

  isMobile(): boolean {
    return window.matchMedia('(max-width: 700px)').matches;
  }

  emit() {
    // Check if the input still has focus. If so, do not save.
    const input = this.elementRef.nativeElement.querySelector('input');
    if (document.activeElement === input || !input.value) {
      return;
    }

    const formValue = this.form.value;
    this.changed.next({
      equality: formValue.equality,
      date: formValue.date ? formValue.date.toISOString() : '',
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
