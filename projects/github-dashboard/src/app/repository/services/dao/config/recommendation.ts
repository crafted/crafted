import {FiltererState} from 'projects/data/src/lib/filterer';

export interface AddLabelAction {
  labels: string[];
}
export interface AddAssigneeAction {
  assignee: string[];
}

export type Action = AddLabelAction|AddAssigneeAction;

export type RecommendationType = 'warning'|'suggestion';

export type ActionType = 'none'|'add-label'|'add-assignee';

export interface Recommendation {
  id?: string;
  message?: string;
  type?: RecommendationType;
  data?: string;
  actionType?: ActionType;
  action?: Action;
  filtererState?: FiltererState;
  dbAdded?: string;
  dbModified?: string;
}
