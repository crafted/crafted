import {DatePipe} from '@angular/common';
import {Viewer, ViewerMetadata, ViewerState} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Recommendation} from '../../repository/model/recommendation';
import {getRecommendations} from '../../repository/utility/get-recommendations';
import {Item} from '../app-types/item';
import {Label} from '../app-types/label';
import {createLabelsMap} from '../utility/create-labels-map';
import {getBorderColor, getTextColor} from '../utility/label-colors';

interface ViewContext {
  item: Item;
  labelsMap: Map<string, Label>;
  recommendations: Recommendation[];
}

const ITEM_TABLE_VIEWER_METADATA = new Map<string, ViewerMetadata<Item, ViewContext>>([
  [
    'Number',
    {
      label: 'Number',
      render: item => ({
        styles: {
          display: 'block',
          marginBottom: '4px',
          fontSize: '15px',
          padding: '2px 0',
        },
        text: `${item.number}`
      }),
    },
  ],

  [
    'title',
    {
      label: 'Title',
      render: item => ({
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
    'reporter',
    {
      label: 'Reporter',
      render: item => ({
        styles: {
          display: 'block',
          fontSize: '13px',
          padding: '2px 0',
        },
        text: `${item.reporter}`
      }),
    },
  ],

  [
    'state',
    {
      label: 'State',

      render: item => {
        return {
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `${item.state}`,
        };
      },
    },
  ],

  [
    'creationDate',
    {
      label: 'Date Created',

      render: item => {
        const datePipe = new DatePipe('en-us');
        return {
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `${datePipe.transform(item.created)}`,
        };
      },
    },
  ],

  [
    'updatedDate',
    {
      label: 'Date Last Updated',
      render: item => {
        const datePipe = new DatePipe('en-us');
        return {
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `${datePipe.transform(item.updated)}`,
        };
      },
    },
  ],

  [
    'assignees',
    {
      label: 'Assignees',
      render: item => {
        if (!item.assignees.length) {
          return null;
        }

        return {
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: `${item.assignees.join(',')}`
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

        const containerStyles = {
          display: 'flex',
          flexWrap: 'wrap',
          fontSize: '13px',
          marginTop: '8px',
          padding: '2px 0'
        };

        const labelStyles = {
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '4px',
          marginRight: '4px',
          marginBottom: '4px',
        };

        return {
          styles: containerStyles, children: item.labels.map(id => {
            const label = context.labelsMap.get(`${id}`);

            if (!label) {
              return {text: ''};
            }

            const styles = {
              ...labelStyles,
              color: getTextColor(label.color),
              borderColor: getBorderColor(label.color),
              backgroundColor: '#' + label.color,
            };

            return {text: label.name, styles};
          }),
        };
      },
    },
  ],
]);

export function getTableViewerProvider(
  labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>):
  (initialState?: ViewerState) => Viewer<Item, ViewContext> {
  return (initialState?: ViewerState) => {
    const contextProvider = createContextProvider(labels, recommendations);
    return new Viewer({metadata: ITEM_TABLE_VIEWER_METADATA, contextProvider, initialState});
  };
}

function createContextProvider(
  labels$: Observable<Label[]>, recommendations$: Observable<Recommendation[]>) {
  return combineLatest(recommendations$, labels$).pipe(map(([recommendations, labels]) => {
    return (item: Item) => ({item, labelsMap: createLabelsMap(labels), recommendations});
  }));
}
