import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, Inject, Injector} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ReplaySubject} from 'rxjs';
import {startWith, take} from 'rxjs/operators';

import {Widget, WIDGET_EDIT_DATA, WidgetConfig, WidgetEditData} from '../dashboard';


export interface WidgetEditDialogData {
  widget?: Widget;
  widgetConfigs: {[key in string]: WidgetConfig<any>};
}
@Component({
  selector: 'widget-edit',
  templateUrl: 'widget-edit.html',
  styleUrls: ['widget-edit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetEdit<S, V, G> {
  form = new FormGroup({
    title: new FormControl(''),
    type: new FormControl(''),
  });

  widgetConfigs: WidgetConfig<any>[] = [];

  optionsPortal: ComponentPortal<any>;

  options = new ReplaySubject(1);

  constructor(
      private dialogRef: MatDialogRef<WidgetEdit<S, V, G>, Widget>,
      @Inject(MAT_DIALOG_DATA) public data: WidgetEditDialogData) {
    for (let id of Object.keys(data.widgetConfigs)) {
      this.widgetConfigs.push(data.widgetConfigs[id]);
    }

    if (data.widget) {
      this.form.setValue({
        title: data.widget.title || '',
        type: data.widget.type,
      });
    } else {
      this.form.get('type')!.setValue(this.widgetConfigs[0].id);
    }

    this.form.get('type')!.valueChanges.pipe(startWith(this.form.value.type)).subscribe(value => {
      return this.showWidgetEdit(value);
    });
  }

  save() {
    this.options.pipe(take(1)).subscribe(options => {
      const widget:
          Widget = {title: this.form.value.title, type: this.form.value.type, options: options};

      this.dialogRef.close(widget);
    });
  }

  private showWidgetEdit(type: string) {
    this.options.next(this.data.widget ? this.data.widget.options : null);
    const widgetData: WidgetEditData<any, any> = {
      options: this.options,
      config: this.data.widgetConfigs[type].config,
    };

    const injectionTokens = new WeakMap<any, any>([[WIDGET_EDIT_DATA, widgetData]]);
    const widgetInjector = new PortalInjector(Injector.NULL, injectionTokens);
    this.optionsPortal =
        new ComponentPortal(this.data.widgetConfigs[type].editComponent, null, widgetInjector);
  }
}
