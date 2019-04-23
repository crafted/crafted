import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {startWith, take, takeUntil} from 'rxjs/operators';

import {WIDGET_EDIT_DATA, WidgetEditData} from '../../dashboard/dashboard';

import {TimeSeriesOptions, TimeSeriesWidgetDataConfig} from './time-series';


@Component({
  selector: 'time-series-edit',
  templateUrl: 'time-series-edit.html',
  styleUrls: ['time-series-edit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesEdit {
  groupOptions: {id: string, label: string}[] = [
    {id: 'day', label: 'Day'},
    {id: 'week', label: 'Week'},
    {id: 'month', label: 'Month'},
  ];

  form = new FormGroup({
    dataSourceType: new FormControl(null),
    start: new FormControl(null),
    end: new FormControl(null),
    group: new FormControl('week'),
    datasets: new FormArray([]),
  });

  datasetsFormArray = this.form.get('datasets') as FormArray;

  destroyed = new Subject();

  constructor(@Inject(WIDGET_EDIT_DATA) public data:
                  WidgetEditData<TimeSeriesOptions, TimeSeriesWidgetDataConfig>) {
    data.options.pipe(take(1)).subscribe(value => {
      if (value) {
        this.initializeForm(value);
      } else {
        this.addDataset();
      }
    });

    this.form.valueChanges.pipe(startWith(this.form.value), takeUntil(this.destroyed))
        .subscribe(value => data.options.next(value));
  }

  removeDataset(index: number) {
    const datasetsFormArray = this.form.get('datasets') as FormArray;
    datasetsFormArray.removeAt(index);
  }

  duplicateDataset(dataset: FormGroup) {
    const datasetsFormArray = this.form.get('datasets') as FormArray;
    datasetsFormArray.push(cloneAbstractControl(dataset));
  }

  addDataset() {
    const newDataset = this.createDataset();
    const datasetsFormArray = this.form.get('datasets') as FormArray;
    datasetsFormArray.push(newDataset);
    this.addAction(newDataset);
    return newDataset;
  }

  addAction(dataset: FormGroup) {
    (dataset.get('actions') as FormArray).push(new FormGroup({
      datePropertyId: new FormControl(),
      type: new FormControl(),
    }));
  }

  private initializeForm(value: TimeSeriesOptions) {
    const datasetsFormArray = this.form.get('datasets') as FormArray;
    value.datasets.forEach(dataset => {
      const datasetFormGroup = this.createDataset();
      dataset.actions.forEach(() => {
        this.addAction(datasetFormGroup);
      });
      datasetsFormArray.push(datasetFormGroup);
    });

    this.form.setValue(value);
  }

  private createDataset() {
    return new FormGroup({
      label: new FormControl('New Series'),
      color: new FormControl(''),
      seriesType: new FormControl('count'),
      actions: new FormArray([]),
      dataSourceType: new FormControl(''),
      filtererState: new FormControl(null),
    });
  }
}

/**
 * Clone function provided by StackOverflow answer:
 * https://stackoverflow.com/questions/48308414/deep-copy-of-angular-reactive-form
 */
export function cloneAbstractControl<T extends AbstractControl>(control: T): T {
  let newControl: T;

  if (control instanceof FormGroup) {
    const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
    const controls = control.controls;

    Object.keys(controls).forEach(key => {
      formGroup.addControl(key, cloneAbstractControl(controls[key]));
    });

    newControl = formGroup as any;
  } else if (control instanceof FormArray) {
    const formArray = new FormArray([], control.validator, control.asyncValidator);

    control.controls.forEach(formControl => formArray.push(cloneAbstractControl(formControl)));

    newControl = formArray as any;
  } else if (control instanceof FormControl) {
    newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
  } else {
    throw new Error('Error: unexpected control value');
  }

  if (control.disabled) {
    newControl.disable({emitEvent: false});
  }

  return newControl;
}
