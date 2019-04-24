import {CdkPortalOutlet, ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Inject,
  Injector,
  ViewChild
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {startWith} from 'rxjs/operators';

import {Widget, WIDGET_DATA, WidgetConfig, WidgetData, WidgetEditor} from '../dashboard';


export interface WidgetEditDialogData {
  widget?: Widget;
  configs: {[key in string]: WidgetConfig<any>};
}

@Component({
  selector: 'widget-edit',
  templateUrl: 'widget-edit.html',
  styleUrls: ['widget-edit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetEdit {
  @ViewChild(CdkPortalOutlet) portalOutlet: CdkPortalOutlet;

  form = new FormGroup({
    title: new FormControl(''),
    type: new FormControl(''),
  });

  typeOptions: {id: string, label: string}[] = [];

  editor: ComponentRef<WidgetEditor>;

  constructor(
      private dialogRef: MatDialogRef<WidgetEdit, Widget>,
      @Inject(MAT_DIALOG_DATA) public data: WidgetEditDialogData) {
    Object.keys(data.configs)
      .forEach(id => this.typeOptions.push({id, label: data.configs[id].label}));

    if (data.widget) {
      this.form.setValue({
        title: data.widget.title || '',
        type: data.widget.type,
      });
    } else {
      this.form.get('type').setValue(this.typeOptions[0].id);
    }
  }

  ngOnInit() {
    this.form.get('type').valueChanges.pipe(startWith(this.form.value.type)).subscribe(type => {
      this.editor = this.attachEditor(type);
    });
  }

  save() {
    this.dialogRef.close({
      title: this.form.value.title,
      type: this.form.value.type,
      options: this.editor.instance.options,
    });
  }

  private attachEditor(type: string): ComponentRef<WidgetEditor> {
    this.portalOutlet.detach();

    const widgetData: WidgetData<any, any> = {
      options: this.data.widget ? this.data.widget.options : null,
      config: this.data.configs[type].config,
    };

    const injectionTokens = new WeakMap<any, any>([[WIDGET_DATA, widgetData]]);
    const widgetInjector = new PortalInjector(Injector.NULL, injectionTokens);
    const portal = new ComponentPortal(this.data.configs[type].editor, null, widgetInjector);
    return this.portalOutlet.attachComponentPortal(portal);
  }
}
