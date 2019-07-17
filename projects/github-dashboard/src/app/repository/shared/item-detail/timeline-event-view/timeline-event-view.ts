import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {TimelineEvent} from 'projects/github-dashboard/src/app/service/github';
import {ReplaySubject} from 'rxjs';
import {dateTimeToString} from '../../time-ago/time-ago';

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

  dateTime$ = new ReplaySubject<string>(1);

  transformedDateTime = this.dateTime$.pipe(dateTimeToString());

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.timelineEvent) {
      this.dateTime$.next(this.timelineEvent.created);
    }
  }
}
