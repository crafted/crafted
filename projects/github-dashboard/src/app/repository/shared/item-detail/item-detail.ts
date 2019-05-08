import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {combineLatest, Observable, of, ReplaySubject} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {completedPagedResults, Github, TimelineEvent, UserComment} from '../../../service/github';
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
  comments: Observable<any[]>;

  itemId$ = new ReplaySubject<string>(1);
  recommendations = this.activeStore.state.pipe(
    switchMap(
      repoState => combineLatest(
        repoState.recommendationsDao.list, repoState.labelsDao.map, this.item$)),
    map(([recommendationsList, labelsMap, item]) =>
      getRecommendations(item, recommendationsList, labelsMap)));
  isLoadingActivities = new ReplaySubject<boolean>(1);
  private distinctItemId$ = this.itemId$.pipe(distinctUntilChanged());
  item$ = combineLatest(this.distinctItemId$, this.activeStore.state)
    .pipe(switchMap(([itemId, repoState]) => repoState.itemsDao.get(itemId)));
  activities = this.distinctItemId$.pipe(
    tap(() => this.isLoadingActivities.next(true)),
    switchMap(() => combineLatest(this.item$, this.activeStore.state)),
    switchMap(([item, repoState]) => {
      // If the created date and updated date are equal, there are no comments or
      // activities.
      if (!item.comments && item.created === item.updated) {
        return of([[], []]);
      }

      const repository = repoState.repository;
      return combineLatest(
        this.github.getComments(repository, item.id).pipe(completedPagedResults<UserComment>()),
        this.github.getTimeline(repository, item.id)
          .pipe(completedPagedResults<TimelineEvent>(), filterExcludedTypes()));
    }),
    map(([comments, timeline]) => {
      const activities: Activity[] = [
        ...comments.map(c => ({type: 'comment', date: c.created, context: c}) as Activity),
        ...timeline.map(e => ({type: 'timeline', date: e.created, context: e}) as Activity)
      ];
      activities.sort((a, b) => a.date < b.date ? -1 : 1);
      return activities;
    }),
    tap(() => this.isLoadingActivities.next(false)), shareReplay(1));
  private itemRepoStatePair = combineLatest(this.item$, this.activeStore.state);

  @Input()
  set itemId(itemId: string) {
    this.itemId$.next(itemId);

    // Scroll up in case the previous item was scrolled
    this.elementRef.nativeElement.scrollTop = 0;
  }

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

  addLabel(id: string, label: string) {
    this.itemRepoStatePair
        .pipe(
          mergeMap(([item, repoState]) => {
            const itemUpdate: Partial<Item> = {id: item.id, labels: [...item.labels, id]};
            repoState.itemsDao.update(itemUpdate);

            return this.github.addLabel(repoState.repository, item.id, label);
          }),
          take(1))
        .subscribe();
  }

  removeLabel(id: string, label: string) {
    this.itemRepoStatePair
      .pipe(
        mergeMap(([item, repoState]) => {
          const labelsCopy = [...item.labels];
          const removedLabelIndex = labelsCopy.indexOf(id);
          labelsCopy.splice(removedLabelIndex, 1);
          const updatedItem: Partial<Item> = {id: item.id, labels: labelsCopy};
          repoState.itemsDao.update(updatedItem);

          return this.github.removeLabel(repoState.repository, item.id, label);
        }),
        take(1))
      .subscribe();
  }

  addAssignee(assignee: string) {
    this.itemRepoStatePair
        .pipe(
          mergeMap(([item, repoState]) => {
            const itemUpdate:
              Partial<Item> = {id: item.id, assignees: [...item.assignees, assignee]};
            repoState.itemsDao.update(itemUpdate);

            return this.github.addAssignee(repoState.repository, item.id, assignee);
          }),
            take(1))
        .subscribe();
  }
}

function filterExcludedTypes(): (timelineEvents$: Observable<TimelineEvent[]>) =>
  Observable<TimelineEvent[]> {
  const excludedTypes = new Set(['mentioned', 'subscribed', 'referenced']);
  return (timelineEvents$: Observable<TimelineEvent[]>) => {
    return timelineEvents$.pipe(
      map(timelineEvents => timelineEvents.filter(t => !excludedTypes.has(t.type))));
  };
}
