import {DatePipe} from '@angular/common';
import {RenderedView, Viewer, ViewerMetadata, ViewerState} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Recommendation} from '../../repository/model/recommendation';
import {getRecommendations} from '../../repository/utility/get-recommendations';
import {Item} from '../app-types/item';
import {Label} from '../app-types/label';
import {createLabelsMap} from '../utility/create-labels-map';
import {getBorderColor, getTextColor} from '../utility/label-colors';

export type ViewType = 'list'|'table';

interface ViewContext {
  item: Item;
  viewType: ViewType;
  labelsMap: Map<string, Label>;
  recommendations: Recommendation[];
}

export const DEFAULT_ISSUE_VIEWS = ['title', 'reporter', 'state', 'updatedDate', 'labels'];
export const DEFAULT_PR_VIEWS = ['title', 'reporter', 'state', 'updatedDate', 'labels'];

const ITEM_VIEWER_METADATA = new Map<string, ViewerMetadata<Item, ViewContext>>([
  [
    'title',
    {
      label: 'Title',
      render: item => ({
        classList: 'title theme-text',
        styles: {
          display: 'block',
          marginBottom: '4px',
          fontSize: '15px',
          padding: '2px 0',
        },
        text: `${item.title}`
      }),
    },
  ],

  [
    'title-detailed',
    {
      label: 'Title (detailed)',
      render: (item, context) => ({
        children: [
          {
            styles: {
              display: 'block',
              marginBottom: '2px',
              fontSize: '14px',
            },
            text: `${item.title}`
          },
          {
            classList: 'theme-secondary-text',
            styles: {
              display: 'inline-block',
              marginRight: '24px',
              fontSize: '12px',
            },
            text: `#${item.number}`
          },
          {
            classList: 'theme-secondary-text',
            styles: {
              display: 'inline-block',
              marginRight: '24px',
              fontSize: '12px',
            },
            text: `${item.reporter}`
          },
          createLabelsContainer(context.labelsMap, item.labels, 'small')
        ]
      }),
    },
  ],

  [
    'reporter',
    {
      label: 'Reporter',
      render: (item, context) => ({
        classList: 'theme-secondary-text',
        styles: {
          display: 'block',
          fontSize: '13px',
          padding: '2px 0',
        },
        text: context.viewType === 'list' ? `Reporter: ${item.reporter}` : item.reporter
      }),
    },
  ],

  [
    'state',
    {
      label: 'State',

      render: (item, context) => {
        return {
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: context.viewType === 'list' ? `State: ${item.state}` : item.state,
        };
      },
    },
  ],

  [
    'creationDate',
    {
      label: 'Date Created',

      render: (item, context) => {
        const datePipe = new DatePipe('en-us');
        const created = datePipe.transform(item.created);
        return {
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: context.viewType === 'list' ? `Created: ${created}` : created,
        };
      },
    },
  ],

  [
    'updatedDate',
    {
      label: 'Date Last Updated',
      render: (item, context) => {
        const datePipe = new DatePipe('en-us');
        const updated = datePipe.transform(item.updated);
        return {
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: context.viewType === 'list' ? `Updated: ${updated}` : updated,
        };
      },
    },
  ],

  [
    'assignees',
    {
      label: 'Assignees',
      render: (item, context) => {
        if (!item.assignees.length) {
          return null;
        }

        const assignees = item.assignees.join(',');
        return {
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: context.viewType === 'list' ? `Assignees: ${assignees}` : assignees
        };
      }
    },
  ],

  [
    'status',
    {
      label: 'Status',
      render: (item, context) => {
        if (!item.statuses || !item.statuses.length) {
          return null;
        }

        // TODO: Better view of the statuses
        const success = item.statuses.every(s => s.state === 'SUCCESS');

        const status = success ? 'Success' : 'Not success';
        return {
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: context.viewType === 'list' ? `Status: ${status}` : status
        };
      }
    },
  ],

  [
    'suggestions',
    {
      label: 'Suggestions',
      render: (item, context) => {
        const allSuggestions = context.recommendations.filter(r => r.type === 'suggestion');
        const suggestions = getRecommendations(item, allSuggestions, context.labelsMap);

        return {
          classList: 'section theme-secondary-text',
          children: suggestions.map(r => ({
                                      text: r.message || '',
                                      styles: {display: 'block', padding: '2px 0'},
                                    })),
          styles: {fontSize: '13px'},
        };
      },
    },
  ],

  [
    'warnings',
    {
      label: 'Warnings',
      render: (item, context) => {
        const allWarnings = context.recommendations.filter(r => r.type === 'warning');
        const warnings = getRecommendations(item, allWarnings, context.labelsMap);

        if (!warnings.length) {
          return null;
        }

        return {
          classList: 'theme-warn',
          children: warnings.map(r => ({
                                   text: r.message || '',
                                   styles: {display: 'block', padding: '2px 0'},
                                 })),
          styles: {fontSize: '13px'},
        };
      },
    },
  ],

  [
    'labels',
    {
      label: 'Labels',
      render: (item, context) => {
        if (!item.labels.length) {
          return null;
        }

        const renderedLabels = createLabelsContainer(context.labelsMap, item.labels, 'large');
        if (context.viewType === 'list') {
          renderedLabels.styles = {
            ...renderedLabels.styles, display: 'flex', justifyContent: 'flex-end',
          };
        }

        return renderedLabels;
      },
    },
  ],
]);

export function getViewerProvider(
    labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>):
    (viewType: Observable<ViewType>, initialState?: ViewerState) => Viewer<Item, ViewContext> {
  return (viewType: Observable<ViewType>, initialState?: ViewerState) => {
    const contextProvider = createContextProvider(labels, recommendations, viewType);
    return new Viewer({metadata: ITEM_VIEWER_METADATA, contextProvider, initialState});
  };
}

function createContextProvider(
    labels$: Observable<Label[]>, recommendations$: Observable<Recommendation[]>,
    viewType$: Observable<ViewType>) {
  return combineLatest(recommendations$, labels$, viewType$)
      .pipe(map(([recommendations, labels, viewType]) => {
        return (item: Item) =>
                   ({item, labelsMap: createLabelsMap(labels), recommendations, viewType});
      }));
}

function createLabelsContainer(
    labelsMap: Map<string, Label>, labelIds: string[], density: 'small'|'large'): RenderedView {
  if (!labelIds) {
    return null;
  }

  return {
    styles: {fontSize: density === 'small' ? '11px' : '13px'},
    children: labelIds.map(id => createLabel(labelsMap.get(`${id}`), density))
  };
}

function createLabel(label: Label, density: 'small'|'large'): RenderedView {
  if (!label) {
    return {text: ''};
  }

  const styles = {
    display: 'inline-block',
    padding: density === 'small' ? '2px 4px' : '4px 8px',
    borderRadius: '4px',
    marginRight: '4px',
    marginBottom: '4px',
    fontWeight: density === 'small' ? 'bold' : '',
    color: getTextColor(label.color),
    borderColor: getBorderColor(label.color),
    backgroundColor: '#' + label.color,
  };

  return {text: label.name, styles};
}
