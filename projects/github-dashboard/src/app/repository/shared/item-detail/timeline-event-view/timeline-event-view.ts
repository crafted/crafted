import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TimelineEvent} from 'projects/github-dashboard/src/app/service/github';

@Component({
  selector: 'timeline-event-view',
  styleUrls: ['timeline-event-view.scss'],
  templateUrl: 'timeline-event-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'theme-secondary-text',
  }
})
export class TimelineEventView {
  @Input() timelineEvent: TimelineEvent;
}
