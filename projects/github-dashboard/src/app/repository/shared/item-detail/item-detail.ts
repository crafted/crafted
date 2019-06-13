import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Observable, of, ReplaySubject} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {Label} from '../../../github/app-types/label';
import {completedPagedResults, Github, TimelineEvent, UserComment} from '../../../service/github';
import {AppState} from '../../store';
import {
  ItemAddAssigneeAction,
  ItemAddLabelAction,
  ItemRemoveLabelAction
} from '../../store/item/item.action';
import {selectItemById, selectItems} from '../../store/item/item.reducer';
import {selectLabels} from '../../store/label/label.reducer';
import {selectRecommendations} from '../../store/recommendation/recommendation.reducer';
import {selectRepositoryName} from '../../store/repository/repository.reducer';
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

  private distinctItemId$ = this.itemId$.pipe(distinctUntilChanged());

  item$ = this.distinctItemId$.pipe(
      mergeMap(itemId => this.store.select(selectItemById(itemId))), filter(item => !!item));

    // TODO: Recommendations should match the data type
  // TODO: Hide actions when not logged in
  recommendations =
      combineLatest(
          this.store.select(selectRecommendations), this.store.select(selectLabels), this.item$)
          .pipe(map(([recommendations, labels, item]) => {
            const labelsMap = new Map<string, Label>();
            labels.forEach(label => labelsMap.set(label.id, label));
            return getRecommendations(item, recommendations, labelsMap);
          }));

  isLoadingActivities = new ReplaySubject<boolean>(1);

  activities = this.distinctItemId$.pipe(
      tap(() => this.isLoadingActivities.next(true)),
      switchMap(() => combineLatest(this.item$, this.store.select(selectRepositoryName))),
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

  addLabelOptions: Observable<{id: string, name: string}[]> =
      this.store.select(selectLabels).pipe(map(labels => {
        const labelOptions = labels.map(label => ({id: label.id, name: label.name}));
        labelOptions.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);
        return labelOptions;
      }));

  addAssigneeOptions: Observable<string[]> = this.store.select(selectItems).pipe(map(items => {
    const assigneesSet = new Set<string>();
    items.forEach(item => item.assignees.forEach(a => assigneesSet.add(a)));
    const assigneesList: string[] = [];
    assigneesSet.forEach(a => assigneesList.push(a));
    return assigneesList.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  }));

  constructor(
      private store: Store<AppState>, private elementRef: ElementRef, public github: Github) {}

  addLabel(labelId: string, labelName: string) {
    this.item$.pipe(take(1)).subscribe(item => {
      this.store.dispatch(new ItemAddLabelAction({itemId: item.id, labelId, labelName}));
    });
  }

  removeLabel(labelId: string, labelName: string) {
    this.item$.pipe(take(1)).subscribe(item => {
      this.store.dispatch(new ItemRemoveLabelAction({itemId: item.id, labelId, labelName}));
    });
  }

  addAssignee(assignee: string) {
    this.item$.pipe(take(1)).subscribe(item => {
      this.store.dispatch(new ItemAddAssigneeAction({itemId: item.id, assignee}));
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
