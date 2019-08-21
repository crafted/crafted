import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {take} from 'rxjs/operators';
import {SavedFiltererState} from '../form/filter-state-option/filter-state-option';
import {Column, ColumnGroup, Dashboard, Widget, WidgetConfig} from './dashboard';
import {WidgetEdit, WidgetEditDialogData} from './widget-edit/widget-edit';

@Component({
  selector: 'dashboard-view',
  templateUrl: 'dashboard-view.html',
  styleUrls: ['dashboard-view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class.edit-mode]': 'edit'}
})
export class DashboardView {
  @Input() dashboard: Dashboard;

  @Input() edit: boolean;

  @Input() widgetConfigs: {[key in string]: WidgetConfig<any>};

  @Input() savedFiltererStates: SavedFiltererState[] = [];

  @Output() dashboardChange = new EventEmitter<Dashboard>();

  @Output() openWidget = new EventEmitter<Widget>();

  trackByIndex = (i: number) => i;

  constructor(private dialog: MatDialog) {}

  addColumnGroup() {
    if (!this.dashboard.columnGroups) {
      this.dashboard.columnGroups = [];
    }

    this.dashboard.columnGroups.push({columns: [{widgets: []}, {widgets: []}, {widgets: []}]});
    this.save();
  }

  addColumn(columnGroup: ColumnGroup) {
    columnGroup.columns.push({widgets: []});
    this.save();
  }

  addWidget(column: Column) {
    this.editWidget(column, column.widgets.length);
  }

  duplicateWidget(column: Column, index: number, widget: Widget) {
    const newWidget = {...widget};
    column.widgets.splice(index, 0, newWidget);
  }

  editWidget(column: Column, index: number, widget?: Widget) {
    const data: WidgetEditDialogData = {
      widget,
      configs: this.widgetConfigs,
    };

    const config: MatDialogConfig<WidgetEditDialogData> = {data, width: '750px'};

    this.dialog.open(WidgetEdit, config).afterClosed().pipe(take(1)).subscribe((result: Widget) => {
      if (result) {
        column.widgets[index] = {...result};
        this.save();
      }
    });
  }

  removeColumnGroup(index: number) {
    if (this.dashboard.columnGroups) {
      this.dashboard.columnGroups.splice(index, 1);
      this.save();
    }
  }

  removeColumn(columnGroup: ColumnGroup, index: number) {
    columnGroup.columns.splice(index, 1);
    this.save();
  }

  removeWidget(column: Column, index: number) {
    column.widgets.splice(index, 1);
    this.save();
  }

  private save() {
    this.dashboardChange.emit(this.dashboard);
  }

  dropWidget(event: CdkDragDrop<Widget[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
          event.previousContainer.data, event.container.data, event.previousIndex,
          event.currentIndex);
    }
    this.save();
  }
}
