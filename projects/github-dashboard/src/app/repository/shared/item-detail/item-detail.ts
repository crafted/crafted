import {ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {Github, TimelineEvent, UserComment} from '../../../service/github';
import {ActiveStore} from '../../services/active-store';
import {Recommendation} from '../../services/dao/config/recommendation';
import {Markdown} from '../../services/markdown';
import {getRecommendations} from '../../utility/get-recommendations';

export interface Activity {
  type: 'comment'|'timeline';
  date: string;
  context: UserComment|TimelineEvent;
}
@Component({
  selector: 'item-detail',
  styleUrls: ['item-detail.scss'],
  templateUrl: 'item-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetail {
  bodyMarkdown: Observable<SafeHtml>;

  recommendations: Observable<Recommendation[]>;

  comments: Observable<any[]>;

  activities: Observable<Activity[]>;

  @Input() item: Item;

  addLabelOptions: Observable<{id: string, label: string}[]> = this.activeStore.data.pipe(
    mergeMap(dataStore => dataStore.labels.list), map(labels => {
      const labelOptions = labels.map(l => ({id: l.id, label: l.name}));
      labelOptions.sort((a, b) => a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1);
      return labelOptions;
    }));

  addAssigneeOptions: Observable<string[]> = this.activeStore.data.pipe(
    mergeMap(dataStore => dataStore.items.list), map(items => {
      const assigneesSet = new Set<string>();
      items.forEach(i => i.assignees.forEach(a => assigneesSet.add(a)));
      const assigneesList: string[] = [];
      assigneesSet.forEach(a => assigneesList.push(a));
      return assigneesList.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    }));

  private destroyed = new Subject();

  constructor(
    private elementRef: ElementRef, private markdown: Markdown, public activeStore: ActiveStore,
    public github: Github) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.item && this.item && this.item.id) {
      this.elementRef.nativeElement.scrollTop = 0;  // Scroll up in case prev item was scrolled
      this.bodyMarkdown = this.activeStore.data.pipe(
        mergeMap(dataStore => this.markdown.getItemBodyMarkdown(dataStore, this.item.id)));

      this.recommendations =
          combineLatest(
            this.activeStore.config.pipe(
              mergeMap(configStore => configStore.recommendations.list)),
            this.activeStore.data.pipe(mergeMap(dataStore => dataStore.labels.map)))
            .pipe(
              map(results =>
                results[0] ? getRecommendations(this.item, results[0], results[1]) : []));

      this.activities = this.activeStore.data.pipe(
          mergeMap(dataStore => {
            return combineLatest(
              this.github.getComments(dataStore.name, this.item.id),
              this.github.getTimeline(dataStore.name, this.item.id));
          }),
          filter(result => {
            const commentsResult = result[0];
            const timelineResult = result[1];

            const commentsFinished = commentsResult.completed === commentsResult.total;
            const timelineFinished = timelineResult.completed === timelineResult.total;
            return commentsFinished && timelineFinished;
          }),
          map(result => {
            const comments = result[0].accumulated as UserComment[];

            const filteredTimelineEvents = new Set(['mentioned', 'subscribed', 'referenced']);
            const timelineEvents =
                (result[1].accumulated as TimelineEvent[])
                    .filter(timelineEvent => !filteredTimelineEvents.has(timelineEvent.type));

            const activities: Activity[] = [];
            comments.forEach(c => activities.push({type: 'comment', date: c.created, context: c}));
            timelineEvents.forEach(
                e => activities.push({type: 'timeline', date: e.created, context: e}));
            activities.sort((a, b) => a.date < b.date ? -1 : 1);

            return activities;
          }));
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addLabel(id: string, label: string) {
    this.activeStore.name
      .pipe(
        mergeMap(repository => this.github.addLabel(repository, this.item.id, label)), take(1))
      .subscribe();

    // Manually patch in the new label to the current item object until the next sync with GitHub.
    combineLatest(this.activeStore.data).pipe(take(1)).subscribe(results => {
      this.item.labels.push(+id);
      results[0].items.update(this.item);
    });
  }

  addAssignee(assignee: string) {
    this.activeStore.name
      .pipe(
        mergeMap(repository => this.github.addAssignee(repository, this.item.id, assignee)),
        take(1))
        .subscribe();

    // Manually patch in the new label to the current item object until the next sync with GitHub.
    combineLatest(this.activeStore.data).pipe(take(1)).subscribe(results => {
      this.item.assignees.push(assignee);
      results[0].items.update(this.item);
    });
  }
}
