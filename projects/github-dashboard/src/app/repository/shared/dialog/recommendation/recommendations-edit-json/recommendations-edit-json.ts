import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Subject} from 'rxjs';

import {Recommendation} from '../../../../model/recommendation';


export interface RecommendationsEditJsonData {
  recommendations: Recommendation[];
}

type ValidationError =
  'invalidJson'
  | 'duplicateId'
  | 'missingId'
  | 'missingAction'
  | 'missingActionType'
  | 'missingData'
  | 'missingFiltererState'
  | 'missingMessage'
  | 'missingType';


const ERRORS: {id: ValidationError, message: (r: Recommendation) => string}[] = [
  {
    id: 'invalidJson',
    message: () => 'JSON is invalid',
  },
  {
    id: 'duplicateId',
    message: r => `Cannot have two recommendations with the same ID (${r.id})`,
  },
  {
    id: 'missingId',
    message: r => `Missing ID for recommendation: "${recToString(r)}"`,
  },
  {
    id: 'missingAction',
    message: r => `Missing action for recommendation: "${recToString(r)}"`,
  },
  {
    id: 'missingActionType',
    message: r => `Missing action type for recommendation: "${recToString(r)}"`,
  },
  {
    id: 'missingData',
    message: r => `Missing data type for recommendation: "${recToString(r)}"`,
  },
  {
    id: 'missingFiltererState',
    message: r => `Missing filterer state for recommendation: "${recToString(r)}"`,
  },
  {
    id: 'missingMessage',
    message: r => `Missing message for recommendation: "${recToString(r)}"`,
  },
  {
    id: 'missingType',
    message: r => `Missing type for recommendation: "${recToString(r)}"`,
  },
];

@Component({
  styleUrls: ['recommendations-edit-json.scss'],
  templateUrl: 'recommendations-edit-json.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationsEditJson {

  constructor(
    public dialogRef: MatDialogRef<RecommendationsEditJson>,
    @Inject(MAT_DIALOG_DATA) public data: RecommendationsEditJsonData) {
    const recommendations = data.recommendations.map(r => {
      const recommendation = ({...r});
      delete recommendation.dbAdded;
      delete recommendation.dbModified;
      return recommendation;
    });
    this.jsonForm.setValue(JSON.stringify(recommendations, null, 2));
  }

  jsonForm = new FormControl('[]', recommendationsValidator);

  errors = ERRORS;

  private destroyed = new Subject();

  errorCount = () => Object.keys(this.jsonForm.errors).length;

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    const recommendations = JSON.parse(this.jsonForm.value) as Recommendation[];
    recommendations.forEach(r => r.dbModified = new Date().toISOString());
    this.dialogRef.close(recommendations);
  }
}

function recommendationsValidator(control: AbstractControl): {[key: string]: any} | null {
  const validation: { [key in string]: {recommendation: Recommendation | null} } = {};
  let recommendations: Recommendation[];

  try {
    recommendations = JSON.parse(control.value) as Recommendation[];
  } catch {
    validation.invalidJson = {recommendation: null};
    return validation;
  }

  const ids = new Set();
  recommendations.forEach(recommendation => {
    if (recommendation.id && ids.has(recommendation.id)) {
      validation.duplicateId = {recommendation};
    }

    if (!recommendation.id) {
      validation.missingId = {recommendation};
    }

    ids.add(recommendation.id);

    if (!recommendation.action) {
      validation.missingAction = {recommendation};
    }

    if (!recommendation.actionType) {
      validation.missingActionType = {recommendation};
    }

    if (!recommendation.dataType) {
      validation.missingData = {recommendation};
    }

    if (recommendation.filtererState === undefined) {
      validation.missingFiltererState = {recommendation};
    }

    if (!recommendation.message) {
      validation.missingMessage = {recommendation};
    }

    if (!recommendation.type) {
      validation.missingType = {recommendation};
    }
  });

  return Object.keys(validation).length ? validation : null;
}

function recToString(r: Recommendation) {
  return r.message ? r.message : r.id ? r.id : JSON.stringify(r);
}
