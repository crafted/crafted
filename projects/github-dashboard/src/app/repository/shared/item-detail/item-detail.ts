import {ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {Github, TimelineEvent, UserComment} from '../../../service/github';
import {Recommendation} from '../../model/recommendation';
import {ActiveStore} from '../../services/active-store';
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
      private elementRef: ElementRef, public activeStore: ActiveStore, public github: Github) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.item && this.item && this.item.id) {
      this.elementRef.nativeElement.scrollTop = 0;  // Scroll up in case prev item was scrolled

      this.recommendations = this.activeStore.state.pipe(
          mergeMap(
              repoState =>
                  combineLatest(repoState.recommendationsDao.list, repoState.labelsDao.map)),
          map(([recommendations, labels]) =>
                  recommendations ? getRecommendations(this.item, recommendations, labels) : []));

      this.activities = this.activeStore.state.pipe(
          mergeMap(
              repoState => combineLatest(
                  this.github.getComments(repoState.repository, this.item.id),
                  this.github.getTimeline(repoState.repository, this.item.id))),
          filter(
              ([comments, timeline]) =>
                  comments.completed === comments.total && timeline.completed === timeline.total),
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
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      this.item.labels = [...this.item.labels, id];
      repoState.itemsDao.update(this.item);
    });
  }

  removeLabel(id: string, label: string) {
    this.activeStore.state
      .pipe(
        map(repoState => repoState.repository),
        mergeMap(repository => this.github.removeLabel(repository, this.item.id, label)), take(1))
      .subscribe();

    // Manually patch in the new label to the current item object until the next sync with GitHub.
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      const index = this.item.labels.indexOf(id);
      this.item.labels.splice(index, 1);
      // Force change detection for label list
      this.item.labels = [...this.item.labels];
      repoState.itemsDao.update(this.item);
    });
  }

  addAssignee(assignee: string) {
    this.activeStore.state
        .pipe(
            mergeMap(
                repoState => this.github.addAssignee(repoState.repository, this.item.id, assignee)),
            take(1))
        .subscribe();

    // Manually patch in the new label to the current item object until the next sync with GitHub.
    this.activeStore.state.pipe(take(1)).subscribe(repoState => {
      this.item.assignees.push(assignee);
      repoState.itemsDao.update(this.item);
    });
  }
}
