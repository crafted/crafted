import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
import {DataResources} from '@crafted/data';

import {Widget, WIDGET_DATA, WidgetConfig, WidgetData} from '../widget';


@Component({
  selector: 'widget-view',
  styleUrls: ['widget-view.scss'],
  templateUrl: 'widget-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetView {
  @Input() widgetConfig: WidgetConfig<any>;

  @Input() widget: Widget;

  @Input() editMode: boolean;

  @Input() dataResourcesMap: Map<string, DataResources>;

  @Output() edit = new EventEmitter<void>();

  @Output() duplicate = new EventEmitter<void>();

  @Output() remove = new EventEmitter<void>();

  @Output() open = new EventEmitter<Widget>();

  widgetComponentPortal: ComponentPortal<any>;

  constructor(private injector: Injector) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['widget'] && this.widget) {
      this.createWidget();
    }
  }

  private createWidget() {
    const widgetData: WidgetData<any, any> = {
      options: this.widget.displayTypeOptions,
      config: this.widgetConfig.config,
    };

    const injectionTokens = new WeakMap<any, any>([[WIDGET_DATA, widgetData]]);
    const widgetInjector = new PortalInjector(this.injector, injectionTokens);
    this.widgetComponentPortal =
        new ComponentPortal(this.widgetConfig.component, null, widgetInjector);
  }
}

export const MaterialColors = [
  '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
  '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11',
  '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'
];
