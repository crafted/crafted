import {Widget} from '../widget/widget';

export interface Column {
  widgets: Widget[];
}

export interface ColumnGroup {
  columns: Column[];
}

export interface Dashboard {
  id?: string;
  name?: string;
  description?: string;
  columnGroups?: ColumnGroup[];
  dbAdded?: string;
  dbModified?: string;
}

export function hasWidgets(dashboard: Dashboard) {
  const columnGroups = dashboard.columnGroups || [];
  return columnGroups.some(columnGroup => {
    return columnGroup.columns.some(column => {
      return column.widgets.some(widget => !!widget);
    });
  });
}
