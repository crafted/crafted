import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  CountDisplayTypeOptions,
  CountWidgetDataConfig,
  WIDGET_DATA,
  WidgetData
} from '@crafted/components';

@Component({
  selector: 'bar-chart',
  template: `I am a bar chart.`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  constructor(@Inject(WIDGET_DATA) public data:
                  WidgetData<CountDisplayTypeOptions, CountWidgetDataConfig>) {
    console.log(data);
  }
}
