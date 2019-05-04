import {ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {Github, TimelineEvent, UserComment} from '../../../service/github';
import {ActiveStore} from '../../services/active-store';
import {Recommendation} from '../../services/dao/config/recommendation';
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
  recommendations: Observable<Recommendation[]>;

  comments: Observable<any[]>;

  activities: Observable<Activity[]>;

  @Input() item: Item;

  addLabelOptions: Observable<{id: string, label: string}[]> = this.activeStore.state.pipe(
    mergeMap(repoState => repoState.labelsDao.list), map(labels => {
      const labelOptions = labels.map(l => ({id: l.id, label: l.name}));
      labelOptions.sort((a, b) => a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1);
      return labelOptions;
    }));

  addAssigneeOptions: Observable<string[]> = this.activeStore.state.pipe(
    mergeMap(repoState => repoState.itemsDao.list), map(items => {
      const assigneesSet = new Set<string>();
      items.forEach(i => i.assignees.forEach(a => assigneesSet.add(a)));
      const assigneesList: string[] = [];
      assigneesSet.forEach(a => assigneesList.push(a));
      return assigneesList.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    }));

  constructor(
    private elementRef: ElementRef, public activeStore: ActiveStore, public github: Github) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.item && this.item && this.item.id) {
      this.elementRef.nativeElement.scrollTop = 0;  // Scroll up in case prev item was scrolled

      this.recommendations = this.activeStore.state.pipe(
        mergeMap(
          repoState =>
            combineLatest(repoState.recommendationsDao.list, repoState.labelsDao.map)),
        map(results => results[0] ? getRecommendations(this.item, results[0], results[1]) : []));

      this.activities = this.activeStore.state.pipe(
        mergeMap(repoState => {
          return combineLatest(
            this.github.getComments(repoState.repository, this.item.id),
            this.github.getTimeline(repoState.repository, this.item.id));
        }),
        filter(result => {
          const commentsFinished = result[0].completed === result[0].total;
          const timelineFinished = result[1].completed === result[1].total;
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

  addLabel(id: string, label: string) {
    this.activeStore.state
      .pipe(
        map(repoState => repoState.repository),
        mergeMap(repository => this.github.addLabel(repository, this.item.id, label)), take(1))
      .subscribe();

    // Manually patch in the new label to the current item object until the next sync with GitHub.
    combineLatest(this.activeStore.state).pipe(take(1)).subscribe(results => {
      this.item.labels.push(id);
      results[0].itemsDao.update(this.item);
    });
  }

  addAssignee(assignee: string) {
    this.activeStore.state
      .pipe(
        mergeMap(repoState => this.github.addAssignee(repoState.repository, this.item.id, assignee)),
        take(1))
      .subscribe();

    // Manually patch in the new label to the current item object until the next sync with GitHub.
    combineLatest(this.activeStore.state).pipe(take(1)).subscribe(results => {
      this.item.assignees.push(assignee);
      results[0].itemsDao.update(this.item);
    });
  }
}
