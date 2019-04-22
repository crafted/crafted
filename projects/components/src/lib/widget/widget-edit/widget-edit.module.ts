import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {
  ButtonToggleGroupOptionModule
} from '../../form/button-toggle-option/button-toggle-option.module';
import {WidgetEdit} from './widget-edit';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    PortalModule,
    ReactiveFormsModule,
    ButtonToggleGroupOptionModule,
  ],
  declarations: [WidgetEdit],
  exports: [WidgetEdit],
  entryComponents: [WidgetEdit]
})
export class WidgetEditModule {
}
