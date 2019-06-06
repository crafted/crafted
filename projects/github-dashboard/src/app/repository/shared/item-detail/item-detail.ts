import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, filter, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {Label} from '../../../github/app-types/label';
import {completedPagedResults, Github, TimelineEvent, UserComment} from '../../../service/github';
import {AppState} from '../../../store';
import {
  ItemAddAssigneeAction,
  ItemAddLabelAction,
  ItemRemoveLabelAction
} from '../../../store/item/item.action';
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

  // TODO: Recommendations should match the data type
  // TODO: Hide actions when not logged in
  recommendations = this.activeStore.state.pipe(
      switchMap(
          repoState => combineLatest(
              repoState.recommendationsDao.list, this.store.select(state => state.labels),
              this.item$)),
      map(([recommendationsList, labelsState, item]) => {
        const labelsMap = new Map<string, Label>();
        labelsState.ids.forEach(id => labelsMap.set(id, labelsState.entities[id]));
        return getRecommendations(item, recommendationsList, labelsMap);
      }));

  isLoadingActivities = new ReplaySubject<boolean>(1);

  private distinctItemId$ = this.itemId$.pipe(distinctUntilChanged());

  item$ = combineLatest(this.distinctItemId$, this.store)
              .pipe(map(([itemId, store]) => store.items.entities[itemId]), filter(item => !!item));

  activities = this.distinctItemId$.pipe(
      tap(() => this.isLoadingActivities.next(true)),
      switchMap(() => combineLatest(this.item$, this.store.select(state => state.repository.name))),
      switchMap(([item, repository]) => {
        // If the created date and updated date are equal, there are no comments or
        // activities.
        if (!item.comments && item.created === item.updated) {
          return of([[], []]);
        }

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

  @Input()
  set itemId(itemId: string) {
    this.itemId$.next(itemId);

    // Scroll up in case the previous item was scrolled
    this.elementRef.nativeElement.scrollTop = 0;
  }

  addLabelOptions: Observable<{id: string, label: string}[]> = this.store.select(state => state.labels).pipe(
      map(labelsState => {
        const labelOptions = labelsState.ids.map(id => ({id, label: labelsState.entities[id].name}));
        labelOptions.sort((a, b) => a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1);
        return labelOptions;
      }));

  addAssigneeOptions: Observable<string[]> =
      this.store.select(state => state.items).pipe(map(itemsState => {
        const assigneesSet = new Set<string>();
        itemsState.ids.forEach(
            id => itemsState.entities[id].assignees.forEach(a => assigneesSet.add(a)));
        const assigneesList: string[] = [];
        assigneesSet.forEach(a => assigneesList.push(a));
        return assigneesList.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
      }));

  constructor(
      private store: Store<AppState>, private elementRef: ElementRef,
      public activeStore: ActiveStore, public github: Github) {}

  addLabel(id: string) {
    this.item$.pipe(take(1)).subscribe(item => {
      this.store.dispatch(new ItemAddLabelAction({id: item.id, label: id}));
    });
  }

  removeLabel(id: string) {
    this.item$.pipe(take(1)).subscribe(item => {
      this.store.dispatch(new ItemRemoveLabelAction({id: item.id, label: id}));
    });
  }

  addAssignee(assignee: string) {
    this.item$.pipe(take(1)).subscribe(item => {
      this.store.dispatch(new ItemAddAssigneeAction({id: item.id, assignee}));
    });
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
