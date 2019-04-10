import {DatePipe} from '@angular/common';
import {Viewer, ViewerMetadata, ViewerState} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Recommendation} from '../../repository/services/dao/config/recommendation';
import {getRecommendations} from '../../repository/utility/get-recommendations';
import {Item} from '../app-types/item';
import {Label} from '../app-types/label';
import {createLabelsMap} from '../utility/create-labels-map';
import {getBorderColor, getTextColor} from '../utility/label-colors';

export function getViewerProvider(
    labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>):
    (initialState?: ViewerState) => Viewer<Item, ViewContext> {
  return (initialState?: ViewerState) => {
    return new Viewer(
        GithubItemViewerMetadata, createContextProvider(labels, recommendations), initialState);
  };
}

function createContextProvider(
    labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>) {
  return combineLatest(recommendations, labels).pipe(map(results => {
    const recommendations = results[0];
    const labelsMap = createLabelsMap(results[1]);
    return (item: Item) => ({item, labelsMap, recommendations});
  }));
}

interface ViewContext {
  item: Item;
  labelsMap: Map<string, Label>;
  recommendations: Recommendation[];
}

const GithubItemViewerMetadata = new Map<string, ViewerMetadata<Item, ViewContext>>([
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
        text: `Title: ${item.title}`
      }),
    },
  ],

  [
    'reporter',
    {
      label: 'Reporter',
      render: item => ({
        classList: 'theme-secondary-text',
        styles: {
          display: 'block',
          fontSize: '13px',
          padding: '2px 0',
        },
        text: `Reporter: ${item.reporter}`
      }),
    },
  ],

  [
    'creationDate',
    {
      label: 'Date Created',

      render: item => {
        const datePipe = new DatePipe('en-us');
        return {
          classList: 'theme-secondary-text',
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `Created: ${datePipe.transform(item.created)}`,
        }
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
          classList: 'theme-secondary-text',
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `Updated: ${datePipe.transform(item.updated)}`,
        }
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
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: `Assignees: ${item.assignees.join(',')}`
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
        }
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
        }
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
          justifyContent: 'flex-end',
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
        }

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
        }
      },
    },
  ],
]);
