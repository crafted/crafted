import {
  getGroupByListValues,
  getGroupByValue,
  Grouper,
  GrouperContextProvider,
  GrouperMetadata,
  GrouperState
} from '@crafted/data';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Item} from '../app-types/item';
import {Label} from '../app-types/label';
import {createLabelsMap} from '../utility/create-labels-map';

export function getGrouperProvider(labels: Observable<Label[]>) {
  return (initialState?: GrouperState) => {
    return new Grouper(
        GithubItemGroupingMetadata, createGrouperContextProvider(labels), initialState);
  };
}

type Group = 'all'|'reporter'|'label'|'assignee';

interface ContextProvider {
  labelsMap: Map<string, Label>;
}

function createGrouperContextProvider(labels: Observable<Label[]>):
    GrouperContextProvider<ContextProvider> {
  return labels.pipe(map(labels => ({labelsMap: createLabelsMap(labels)})));
}

const GithubItemGroupingMetadata = new Map<Group, GrouperMetadata<Item, Group, ContextProvider>>([
  [
    'all', {
      id: 'all',
      label: 'All',
      groupingFunction: (items: Item[]) => [{id: 'all', title: 'All', items}],
      titleTransform: () => ''
    }
  ],
  [
    'reporter', {
      id: 'reporter',
      label: 'Reporter',
      groupingFunction: (items: Item[]) => getGroupByValue(items, 'reporter'),
    }
  ],
  [
    'label', {
      id: 'label',
      label: 'Label',
      groupingFunction: (items: Item[]) => getGroupByListValues(items, 'labels'),
      titleTransform: (title: string, c: ContextProvider) => {
        if (!title) {
          return 'No labels';
        }

        const label = c.labelsMap.get(title);
        return label ? label.name : 'No label';
      }
    }
  ],
  [
    'assignee', {
      id: 'assignee',
      label: 'Assignee',
      groupingFunction: (items: Item[]) => getGroupByListValues(items, 'assignees'),
      titleTransform: (title: string) => title != 'null' ? title : 'No assignee'
    }
  ],
]);
