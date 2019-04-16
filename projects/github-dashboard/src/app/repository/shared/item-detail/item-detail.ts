import {ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {combineLatest, Observable, Subject} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {Github, TimelineEvent, UserComment} from '../../../service/github';
import {ActiveStore} from '../../services/active-store';
import {Recommendation} from '../../services/dao/config/recommendation';
import {Dao} from '../../services/dao/data-dao';
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

  @Input() itemId: string;

  item: Observable<Item|null>;

  addLabelOptions = this.activeRepo.activeData.labels.list.pipe(map(labels => {
    const labelOptions = labels.map(l => ({id: l.id, label: l.name}));
    labelOptions.sort((a, b) => a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1);
    return labelOptions;
  }));

  addAssigneeOptions = this.activeRepo.activeData.items.list.pipe(map(items => {
    const assigneesSet = new Set<string>();
    items.forEach(i => i.assignees.forEach(a => assigneesSet.add(a)));
    const assigneesList: string[] = [];
    assigneesSet.forEach(a => assigneesList.push(a));
    return assigneesList.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1)
        .map(a => ({id: a, label: a}));
  }));

  private destroyed = new Subject();

  constructor(
      private elementRef: ElementRef, private markdown: Markdown, public activeRepo: ActiveStore,
      public github: Github, public dao: Dao) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['itemId'] && this.itemId) {
      this.elementRef.nativeElement.scrollTop = 0;  // Scroll up in case prev item was scrolled
      this.itemId = `${this.itemId}`;  // Make sure its a string since maps are string-ID based
      const store = this.dao.get(this.activeRepo.activeName);
      this.item = store.items.get(this.itemId);
      this.bodyMarkdown = this.markdown.getItemBodyMarkdown(store, this.itemId);

      this.recommendations =
          combineLatest(
              this.item, this.activeRepo.activeConfig.recommendations.list,
              this.activeRepo.activeData.labels.map)
              .pipe(map(
                  results =>
                      results[0] ? getRecommendations(results[0], results[1], results[2]) : []));

      this.activities = this.activeRepo.data.pipe(
          mergeMap(dataStore => {
            return combineLatest(
                this.github.getComments(dataStore.name!, this.itemId),
                this.github.getTimeline(dataStore.name!, this.itemId));
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
    this.github.addLabel(this.activeRepo.activeName, this.itemId, label).pipe(take(1)).subscribe();

    this.item.pipe(take(1)).subscribe(item => {
      item.labels.push(+id);
      this.activeRepo.activeData.items.update(item);
    });
  }

  addAssignee(assignee: string) {
    this.github.addAssignee(this.activeRepo.activeName, this.itemId, assignee)
        .pipe(take(1))
        .subscribe();

    this.item.pipe(take(1)).subscribe(item => {
      item.assignees.push(assignee);
      this.activeRepo.activeData.items.update(item);
    });
  }
}
