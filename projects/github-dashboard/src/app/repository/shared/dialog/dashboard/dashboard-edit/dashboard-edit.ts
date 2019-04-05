import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface QueryEditData {
  name: string;
  description: string;
}

@Component({
  styleUrls: ['dashboard-edit.scss'],
  templateUrl: 'dashboard-edit.html',
  host: {'(keyup.Enter)': 'save()'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardEdit {
  formGroup = new FormGroup(
      {name: new FormControl('', Validators.required), description: new FormControl('')});

  constructor(
      public dialogRef: MatDialogRef<DashboardEdit>,
      @Inject(MAT_DIALOG_DATA) public data: QueryEditData) {
    if (data && data.name) {
      this.formGroup.get('name')!.setValue(data.name);
    }

    if (data && data.description) {
      this.formGroup.get('description')!.setValue(data.description);
    }
  }


  save() {
    if (this.formGroup.valid) {
      this.dialogRef.close({
        name: this.formGroup.get('name')!.value,
        description: this.formGroup.get('description')!.value
      });
    }
  }
}
