import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';

import {Recommendation} from '../../../../services/dao/config/recommendation';


export interface RecommendationsEditJsonData {
  recommendations: Recommendation[];
}

export interface RecommendationsEditJsonResult {
  recommendations: Recommendation[];
}

@Component({
  styleUrls: ['recommendations-edit-json.scss'],
  templateUrl: 'recommendations-edit-json.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationsEditJson {
  jsonForm = new FormControl('[]', recommendationsValidator);


  private destroyed = new Subject();

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

function recommendationsValidator(control: AbstractControl): {[key: string]: any}|null {
  let recommendations: Recommendation[];

  try {
    recommendations = JSON.parse(control.value) as Recommendation[];
  } catch {
    return {'invalid': {value: control.value}};
  }

  const valid = recommendations.every(recommendation => {
    return !!recommendation.action && !!recommendation.actionType && !!recommendation.data &&
        !!recommendation.filtererState && !!recommendation.message && !!recommendation.type;
  });

  return valid ? null : {'invalid': {value: control.value}};
}
