import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormField, FormFieldLabel} from './form-field';

@NgModule({
  imports: [CommonModule, PortalModule],
  declarations: [FormField, FormFieldLabel],
  exports: [FormField, FormFieldLabel],
})
export class FormFieldModule {
}
