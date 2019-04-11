import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  CountDisplayTypeOptions,
  CountWidgetDataConfig,
  EDIT_WIDGET_DATA,
  EditWidgetData
} from '@crafted/components';

@Component({
  template: `I edit bar charts.`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBarChart {
  constructor(@Inject(EDIT_WIDGET_DATA) public data:
                  EditWidgetData<CountDisplayTypeOptions, CountWidgetDataConfig>) {
    console.log(data);
  }
}
