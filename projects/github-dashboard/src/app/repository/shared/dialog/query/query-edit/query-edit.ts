import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

import {ActiveStore} from '../../../../services/active-store';


export interface QueryEditData {
  name: string;
  group: string;
}

export interface QueryEditResult {
  name: string;
  group: string;
}

@Component({
  styleUrls: ['query-edit.scss'],
  templateUrl: 'query-edit.html',
  host: {'(keyup.Enter)': 'save()'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryEdit {
  formGroup =
      new FormGroup({name: new FormControl('', Validators.required), group: new FormControl('')});

  filteredGroupOptions =
      combineLatest(this.activeRepo.activeConfig.queries.list, this.formGroup.valueChanges)
          .pipe(map(result => {
            const queries = result[0];
            const groupOptionsSet = new Set<string>();
            queries.forEach(query => {
              if (query.group) {
                groupOptionsSet.add(query.group);
              }
            });

            const groupOptions: string[] = [];
            groupOptionsSet.forEach(groupOption => groupOptions.push(groupOption));
            return this._filter(this.formGroup.value.group, groupOptions);
          }));

  constructor(
      public dialogRef: MatDialogRef<QueryEdit>, private activeRepo: ActiveStore,
      @Inject(MAT_DIALOG_DATA) public data: QueryEditData) {
    if (data && data.name) {
      this.formGroup.get('name').setValue(data.name);
    }

    if (data && data.group) {
      this.formGroup.get('group').setValue(data.group);
    }
  }


  save() {
    if (this.formGroup.valid) {
      this.dialogRef.close(
        {name: this.formGroup.get('name').value, group: this.formGroup.get('group').value});
    }
  }

  private _filter(value: string, values: string[]): string[] {
    const filterValue = value.toLowerCase();
    return values.filter(option => option.toLowerCase().includes(filterValue));
  }
}
