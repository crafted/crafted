import {ComponentType} from '@angular/cdk/overlay/index';
import {InjectionToken} from '@angular/core';

export interface WidgetEditor<T = any> {
  options: T;
}

export const WIDGET_DATA = new InjectionToken<any>('WidgetData');

export interface WidgetData<T, C> {
  options: T;
  config: C;
}

export interface Widget {
  title: string;
  type: string;
  options?: any;
}

export interface WidgetConfig<C> {
  id: string;
  label: string;
  component: ComponentType<any>;
  editComponent: ComponentType<WidgetEditor>;
  config: C;
}

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
