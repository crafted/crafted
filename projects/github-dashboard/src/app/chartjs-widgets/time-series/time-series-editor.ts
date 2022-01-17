import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

import {WIDGET_DATA, WidgetData, WidgetEditor} from 'projects/github-dashboard/src/app/components';

import {TimeSeriesOptions, TimeSeriesWidgetDataConfig} from './time-series';


@Component({
  selector: 'time-series-editor',
  templateUrl: 'time-series-editor.html',
  styleUrls: ['time-series-editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesEditor implements WidgetEditor {
  groupOptions: {id: string, label: string}[] = [
    {id: 'day', label: 'Day'},
    {id: 'week', label: 'Week'},
    {id: 'month', label: 'Month'},
  ];

  form = new FormGroup({
    dataType: new FormControl(null),
    start: new FormControl(null),
    end: new FormControl(null),
    group: new FormControl('week'),
    datasets: new FormArray([]),
  });

  datasetsFormArray = this.form.get('datasets') as FormArray;

  get options(): TimeSeriesOptions {
    return this.form.value;
  }

  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<TimeSeriesOptions, TimeSeriesWidgetDataConfig>) {
    this.initializeForm(data.options);
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
    const newDataset = createDataset();
    const datasetsFormArray = this.form.get('datasets') as FormArray;
    datasetsFormArray.push(newDataset);
    this.addAction(newDataset);
    return newDataset;
  }

  addAction(dataset: FormGroup) {
    (dataset.get('actions') as FormArray).push(new FormGroup({
      datePropertyId: new FormControl(),
      countPropertyId: new FormControl(),
      type: new FormControl(),
    }));
  }

  private initializeForm(value: TimeSeriesOptions) {
    if (value.end) {
      this.form.get('end').setValue(value.end);
    }

    if (value.start) {
      this.form.get('start').setValue(value.start);
    }

    if (value.group) {
      this.form.get('group').setValue(value.group);
    }

    if (value.datasets) {
      const datasetsFormArray = this.form.get('datasets') as FormArray;
      value.datasets.forEach(dataset => {
        const datasetFormGroup = createDataset();
        dataset.actions.forEach(() => this.addAction(datasetFormGroup));
        datasetsFormArray.push(datasetFormGroup);
      });
      this.form.get('datasets').setValue(value.datasets);
    } else {
      this.addDataset();
    }
  }
}

function createDataset() {
  return new FormGroup({
    label: new FormControl('New Series'),
    color: new FormControl(''),
    seriesType: new FormControl('count'),
    actions: new FormArray([]),
    dataType: new FormControl(''),
    filtererState: new FormControl(null),
  });
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
