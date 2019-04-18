import {CdkScrollable} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import {
  DataSource,
  Filterer,
  Group,
  Grouper,
  RendererState,
  renderItemGroups,
  Sorter,
  Viewer
} from '@crafted/data';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'items-list',
  templateUrl: 'items-list.html',
  styleUrls: ['items-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsList<T> {
  @Input() activeItem: T;

  @Input() sorter: Sorter<T>;

  @Input() grouper: Grouper<T>;

  @Input() filterer: Filterer<T>;

  @Input() dataSource: DataSource<T>;

  @Input() viewer: Viewer<T>;

  @Output() itemSelected = new EventEmitter<T>();

  itemCount: Observable<number>;

  itemGroups: Observable<Group<T>[]>;

  trackByIndex = (i: number) => i;

  trackByGroupId = (_i: number, itemGroup: Group<T>) => itemGroup.id;

  renderState = new Subject<RendererState<T>>();

  hasMore = this.renderState.pipe(map(state => state.count < state.total));

  @ViewChild(CdkScrollable) scrollableContainer: CdkScrollable;

  private destroyed = new Subject();

  constructor(public ngZone: NgZone, public elementRef: ElementRef) {}

  ngOnInit() {
    this.itemGroups =
        this.dataSource.data.pipe(this.filterer.filter(), this.sorter.sort(), this.grouper.group());

    this.itemCount = this.itemGroups.pipe(map(
        itemGroups => itemGroups.map(g => g.items.length).reduce((prev, curr) => curr += prev)));

    this.itemGroups
        .pipe(
            renderItemGroups(this.scrollableContainer.elementScrolled()), takeUntil(this.destroyed))
        .subscribe(result => this.ngZone.run(() => this.renderState.next(result)));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
