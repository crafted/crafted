import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {Grouper, GroupLabel, Sorter, SortLabel, Viewer, ViewLabel} from 'projects/github-dashboard/src/app/data';
import {take} from 'rxjs/operators';


@Component({
  selector: 'display-options',
  templateUrl: 'display-options.html',
  styleUrls: ['display-options.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayOptions {
  groups: GroupLabel[];

  sorts: SortLabel[];

  views: ViewLabel[];

  @Input() grouper: Grouper;

  @Input() sorter: Sorter;

  @Input() viewer: Viewer;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.grouper) {
      this.groups = this.grouper ? this.grouper.getGroups() : [];
    }
    if (simpleChanges.sorter) {
      this.sorts = this.sorter ? this.sorter.getSorts() : [];
    }
    if (simpleChanges.viewer) {
      this.views = this.viewer ? this.viewer.getViews() : [];
    }
  }

  setGroup(group: string) {
    this.grouper.setState({group});
  }

  setSort(sort: string) {
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

  toggleViewKey(view: string) {
    this.viewer.toggle(view);
  }
}
