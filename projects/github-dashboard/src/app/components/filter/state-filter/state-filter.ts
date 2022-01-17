import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {StateEquality} from 'projects/github-dashboard/src/app/data';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'state-filter',
  templateUrl: 'state-filter.html',
  styleUrls: ['state-filter.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateFilter implements OnChanges {
  equalities: {id: StateEquality, label: string}[] = [
    {id: 'is', label: 'is'},
    {id: 'notIs', label: 'is not'},
  ];
  form = new FormGroup({
    equality: new FormControl('is'),
    state: new FormControl(''),
  });
  destroyed = new Subject();

  @Input() state: string;

  @Input() equality: StateEquality;

  @Input() states: string[];

  @Output() changed = new EventEmitter<{state: string, equality: StateEquality}>();

  constructor() {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.changed.next(value));
  }

  ngOnInit() {
    if (!this.state) {
      this.form.get('state').setValue(this.states[0]);
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.equality) {
      this.form.get('equality').setValue(this.equality, {emitEvent: false});
    }

    if (simpleChanges.state) {
      this.form.get('state').setValue(this.state, {emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
