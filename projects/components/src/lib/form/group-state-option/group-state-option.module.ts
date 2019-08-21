import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {FormFieldModule} from '../form-field/form-field.module';
import {GroupStateOption} from './group-state-option';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormFieldModule,
  ],
  declarations: [GroupStateOption],
  exports: [GroupStateOption],
})
export class GroupStateOptionModule {
}
