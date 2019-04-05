import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {ButtonToggleGroupOptionModule} from './button-toggle-option/button-toggle-option.module';
import {EditWidget} from './edit-widget';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    PortalModule,
    ReactiveFormsModule,
    ButtonToggleGroupOptionModule,
  ],
  declarations: [EditWidget],
  exports: [EditWidget],
  entryComponents: [EditWidget]
})
export class EditWidgetModule {
}
