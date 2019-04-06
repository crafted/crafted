import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, Inject, Injector} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FiltererState} from '@crafted/data';
import {ReplaySubject} from 'rxjs';
import {startWith, take} from 'rxjs/operators';

import {EDIT_WIDGET_DATA, EditWidgetData, Widget, WidgetConfig} from '../widget';


export interface SavedFiltererState {
  state: FiltererState;
  group: string;
  label: string;
  dataSourceType: string;
}

export interface EditWidgetDialogData {
  widget?: Widget;
  widgetConfigs: {[key in string]: WidgetConfig<any>};
}
@Component({
  templateUrl: 'edit-widget.html',
  styleUrls: ['edit-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditWidget<S, V, G> {
  form = new FormGroup({
    title: new FormControl(''),
    displayType: new FormControl(''),
  });

  widgetConfigs: WidgetConfig<any>[] = [];

  optionsPortal: ComponentPortal<any>;

  options = new ReplaySubject(1);

  constructor(
      private dialogRef: MatDialogRef<EditWidget<S, V, G>, Widget>,
      @Inject(MAT_DIALOG_DATA) public data: EditWidgetDialogData) {
    for (let id of Object.keys(data.widgetConfigs)) {
      this.widgetConfigs.push(data.widgetConfigs[id]);
    }

    if (data.widget) {
      this.form.setValue({
        title: data.widget.title || '',
        displayType: data.widget.displayType,
      });
    } else {
      this.form.get('displayType')!.setValue(this.widgetConfigs[0].id);
    }

    this.form.get('displayType')!.valueChanges.pipe(startWith(this.form.value.displayType))
        .subscribe(value => {
          return this.createEditWidget(value);
        });
  }

  save() {
    this.options.pipe(take(1)).subscribe(options => {
      const widget: Widget = {
        title: this.form.value.title,
        displayType: this.form.value.displayType,
        displayTypeOptions: options
      };

      this.dialogRef.close(widget);
    });
  }

  private createEditWidget(type: string) {
    this.options.next(this.data.widget ? this.data.widget.displayTypeOptions : null);
    const widgetData: EditWidgetData<any, any> = {
      options: this.options,
      config: this.data.widgetConfigs[type].config,
    };

    const injectionTokens = new WeakMap<any, any>([[EDIT_WIDGET_DATA, widgetData]]);
    const widgetInjector = new PortalInjector(Injector.NULL, injectionTokens);
    this.optionsPortal =
        new ComponentPortal(this.data.widgetConfigs[type].editComponent, null, widgetInjector);
  }
}
