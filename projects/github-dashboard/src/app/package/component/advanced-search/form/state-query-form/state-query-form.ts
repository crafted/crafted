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
import {InputEquality, StateQuery} from '@crafted/data';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'state-query-form',
  templateUrl: 'state-query-form.html',
  styleUrls: ['state-query-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateQueryForm implements OnChanges {
  equalities: {id: InputEquality, label: string}[] = [
    {id: 'is', label: 'is'},
    {id: 'notIs', label: 'is not'},
  ];
  form = new FormGroup({
    equality: new FormControl('is'),
    state: new FormControl(''),
  });
  destroyed = new Subject();

  @Input() query: StateQuery;

  @Input() states: string[];

  @Output() queryChange = new EventEmitter<StateQuery>();

  constructor() {
    this.form.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(value => this.queryChange.next(value));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.query) {
      if (this.query && this.query.equality) {
        this.form.get('equality')!.setValue(this.query.equality || '', {emitEvent: false});
      }

      if (this.query && this.query.state) {
        this.form.get('state')!.setValue(this.query.state || '', {emitEvent: false});
      }
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
