import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DataResources} from '@crafted/data';
import {take} from 'rxjs/operators';
import {
  EditWidget,
  EditWidgetDialogData,
  SavedFiltererState
} from '../widget/edit-widget/edit-widget';
import {Widget, WidgetConfig} from '../widget/widget';
import {Column, ColumnGroup, Dashboard} from './dashboard';

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

  @Input() dataResourcesMap: Map<string, DataResources>;

  @Input() widgetConfigs: {[key in string]: WidgetConfig<any>};

  @Input() savedFiltererStates: SavedFiltererState[] = [];

  @Output() dashboardChange = new EventEmitter<Dashboard>();

  @Output() openWidget = new EventEmitter<Widget>();

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
    const data: EditWidgetDialogData = {
      widget: widget,
      widgetConfigs: this.widgetConfigs,
    };

    const config: MatDialogConfig<EditWidgetDialogData> = {data, width: '650px'};

    this.dialog.open(EditWidget, config).afterClosed().pipe(take(1)).subscribe((result: Widget) => {
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
