import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {take} from 'rxjs/operators';
import {Grouper, GrouperMetadata} from '../../data-source/grouper';
import {Sorter, SortingMetadata} from '../../data-source/sorter';
import {Viewer, ViewerMetadata} from '../../data-source/viewer';

@Component({
  selector: 'display-options-header',
  templateUrl: 'display-options-header.html',
  styleUrls: ['display-options-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayOptionsHeader<G, S, V> {
  groups: Map<G, GrouperMetadata<any, G, any>>;
  groupIds: G[] = [];

  sorts: Map<S, SortingMetadata<any, S, null>>;
  sortIds: S[] = [];

  views: Map<V, ViewerMetadata<V, any>>;
  viewIds: V[] = [];

  @Input() hideGrouping: boolean;

  @Input() itemCount: number;

  @Input()
  set grouper(grouper: Grouper<any, G, any>) {
    this._grouper = grouper;
    if (this.grouper) {
      this.groups = this.grouper.metadata;
      this.groupIds = this.grouper.getGroups().map(value => value.id);
    }
  }
  get grouper(): Grouper<any, G, any> {
    return this._grouper;
  }
  _grouper: Grouper<any, G, any>;

  @Input()
  set sorter(sorter: Sorter<any, S, any>) {
    this._sorter = sorter;
    if (this.sorter) {
      this.sorts = this.sorter.metadata;
      this.sortIds = this.sorter.getSorts().map(value => value.id);
    }
  }
  get sorter(): Sorter<any, S, any> {
    return this._sorter;
  }
  _sorter: Sorter<any, S, any>;

  @Input()
  set viewer(viewer: Viewer<V, any, any>) {
    this._viewer = viewer;
    if (this.viewer) {
      this.views = this.viewer.metadata;
      this.viewIds = this.viewer.getViews().map(value => value.id);
    }
  }
  get viewer(): Viewer<V, any, any> {
    return this._viewer;
  }
  _viewer: Viewer<V, any, any>;

  setGroup(group: G) {
    this.grouper.state.pipe(take(1)).subscribe(state => {
      this.grouper.setState({...state, group});
    });
  }

  setSort(sort: S) {
    this.sorter.state.pipe(take(1)).subscribe(state => {
      let reverse = state.reverse;
      if (state.sort === sort) {
        reverse = !reverse;
      } else {
        reverse = false;
      }

      this.sorter.setState({...state, sort, reverse});
    });
  }

  toggleViewKey(view: V) {
    this.viewer.toggle(view);
  }
}
