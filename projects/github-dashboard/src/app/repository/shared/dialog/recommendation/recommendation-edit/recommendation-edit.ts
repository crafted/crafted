import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataSource, Filterer} from '@crafted/data';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {AppState} from '../../../../../store';

import {
  ACTION_TYPES,
  ActionType,
  Recommendation,
  RECOMMENDATION_TYPES
} from '../../../../model/recommendation';
import {RecommendationsDataResourcesMap} from '../recommendation-dialog';

export interface RecommendationEditData {
  recommendation: Recommendation;
  dataResourcesMap: RecommendationsDataResourcesMap;
}

@Component({
  styleUrls: ['recommendation-edit.scss'],
  templateUrl: 'recommendation-edit.html',
  host: {'(keyup.Enter)': 'save()'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationEdit {
  formGroup = new FormGroup({
    message: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    dataType: new FormControl('', Validators.required),
    action: new FormControl(null),
    actionType: new FormControl('', Validators.required),
    filtererState: new FormControl(null),
  });

  dataOptions: {id: string, label: string}[] = [];

  typeOptions: {id: string,
                icon: string,
                label: string}[] = Object.keys(RECOMMENDATION_TYPES).map(key => {
    return {id: key, icon: RECOMMENDATION_TYPES[key].icon, label: RECOMMENDATION_TYPES[key].label};
  });

  actionOptions: {id: string, label: string}[] = Object.keys(ACTION_TYPES).map(key => {
    return {id: key, label: ACTION_TYPES[key].label};
  });

  addLabelsOptions = this.store.select(state => state.labels).pipe(map(labelsState => {
    const labelNames = labelsState.ids.map(id => labelsState.entities[id].name);
    labelNames.sort();
    return labelNames.map(name => ({id: name, label: name}));
  }));

  addAssigneesOptions = this.store.select(state => state.items).pipe(map(itemsState => {
    const assigneesSet = new Set<string>();
    itemsState.ids.forEach(
        id => itemsState.entities[id].assignees.forEach(a => assigneesSet.add(a)));
    const assigneesList: string[] = [];
    assigneesSet.forEach(a => assigneesList.push(a));
    return assigneesList.sort().map(a => ({id: a, label: a}));
  }));

  filterer: Filterer;

  dataSource: DataSource;

  private destroyed = new Subject();

  constructor(
      public dialogRef: MatDialogRef<RecommendationEdit, Recommendation>, private store: Store<AppState>,
      @Inject(MAT_DIALOG_DATA) public data: RecommendationEditData) {
    if (!data && !data.recommendation) {
      throw Error('Recommendation required to show recommendation dialog');
    }

    const actionForm = this.formGroup.get('action') as FormControl;
    actionForm.validator = actionValidator(this.formGroup);

    this.data.dataResourcesMap.forEach(d => this.dataOptions.push({id: d.type, label: d.label}));

    const dataForm = this.formGroup.get('dataType');
    dataForm.valueChanges.subscribe((value: string) => {
      const dataResource = this.data.dataResourcesMap.get(value);
      this.filterer = dataResource.filterer();
      this.dataSource = dataResource.dataSource();
    });

    if (data.recommendation) {
      this.formGroup.setValue({
        message: data.recommendation.message || '',
        type: data.recommendation.type || 'warning',
        dataType: data.recommendation.dataType || this.dataOptions[0].id,
        actionType: data.recommendation.actionType || 'none',
        action: data.recommendation.action || null,
        filtererState: data.recommendation.filtererState || null
      });
    }

    this.formGroup.get('actionType')
        .valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(() => this.formGroup.get('action').setValue(null));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  setAddLabelAction(name: string[]) {
    this.formGroup.get('action').setValue({labels: name});
  }

  setAddAssigneeAction(name: string[]) {
    this.formGroup.get('action').setValue({assignees: name});
  }


  save() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const recommendation: Recommendation = {
        ...this.data.recommendation,
        message: formValue.message,
        type: formValue.type,
        dataType: formValue.dataType,
        actionType: formValue.actionType,
        action: formValue.action,
        filtererState: formValue.filtererState,
      };
      this.dialogRef.close(recommendation);
    }
  }
}

export function actionValidator(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any}|null => {
    const actionType = formGroup.get('actionType').value as ActionType;

    switch (actionType) {
      case 'add-assignee':
      case 'add-label':
        return control.value ? null : {invalid: control.value};
      default:
        return null;
    }
  };
}
