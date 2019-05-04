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

export const RECOMMENDATION_TYPES:
    {[key in RecommendationType]: {icon: string, label: string, warn?: boolean}} = {
  warning: {icon: 'warning', label: 'Warning', warn: true},
  suggestion: {icon: 'label_important', label: 'Suggestion'},
};

export const ACTION_TYPES: { [key in ActionType]: {label: string} } = {
  none: {label: 'None'},
  'add-label': {label: 'Add Label'},
  'add-assignee': {label: 'Add Assignee'},
};

export interface Recommendation {
  id?: string;
  message?: string;
  type?: RecommendationType;
  dataType?: string;
  actionType?: ActionType;
  action?: Action;
  filtererState?: FiltererState;
  dbAdded?: string;
  dbModified?: string;
}
