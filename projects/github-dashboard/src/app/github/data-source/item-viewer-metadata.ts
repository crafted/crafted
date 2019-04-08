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
    const contextProvider = createContextProvider(labels, recommendations);
    const viewer = new Viewer(GithubItemViewerMetadata, contextProvider);
    viewer.setState(initialState || {views: viewer.getViews().map(v => v.id)});
    return viewer;
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

const GithubItemViewerMetadata = new Map<string, ViewerMetadata<ViewContext>>([
  [
    'title',
    {
      label: 'Title',
      render: (c: ViewContext) => ({
        classList: 'title theme-text',
        styles: {display: 'block', marginBottom: '4px', fontSize: '15px', padding: '2px 0'},
        text: `Title: ${c.item.title}`
      }),
    },
  ],

  [
    'reporter',
    {
      label: 'Reporter',
      render: (c: ViewContext) => ({
        classList: 'theme-secondary-text',
        styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
        text: `Reporter: ${c.item.reporter}`
      }),
    },
  ],

  [
    'creationDate',
    {
      label: 'Date Created',

      render: (c: ViewContext) => {
        const datePipe = new DatePipe('en-us');
        return {
          classList: 'theme-secondary-text',
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `Created: ${datePipe.transform(c.item.created)}`,
        }
      },
    },
  ],

  [
    'updatedDate',
    {
      label: 'Date Last Updated',
      render: (c: ViewContext) => {
        const datePipe = new DatePipe('en-us');
        return {
          classList: 'theme-secondary-text',
              styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
              text: `Updated: ${datePipe.transform(c.item.updated)}`,
        }
      },
    },
  ],

  [
    'assignees',
    {
      label: 'Assignees',
      render: (c: ViewContext) => {
        if (!c.item.assignees.length) {
          return {};
        }
        return {
          classList: 'theme-secondary-text',
          styles: {display: 'block', fontSize: '13px', padding: '2px 0'},
          text: `Assignees: ${c.item.assignees.join(',')}`
        };
      }
    },
  ],

  [
    'suggestions',
    {
      label: 'Suggestions',
      render: (c: ViewContext) => {
        const allSuggestions = c.recommendations.filter(r => r.type === 'suggestion');
        const suggestions = getRecommendations(c.item, allSuggestions, c.labelsMap);

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
      render: (c: ViewContext) => {
        const allWarnings = c.recommendations.filter(r => r.type === 'warning');
        const warnings = getRecommendations(c.item, allWarnings, c.labelsMap);

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
      render: (c: ViewContext) => {
        return {
          styles: {
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            fontSize: '13px',
            marginTop: '8px',
            padding: '2px 0'
          },
              children: c.item.labels.map(id => {
                const label = c.labelsMap.get(`${id}`);

                if (!label) {
                  return {text: ''};
                }

                const styles = {
                  color: getTextColor(label.color),
                  borderColor: getBorderColor(label.color),
                  backgroundColor: '#' + label.color,
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '4px',
                  marginBottom: '4px',
                };

                return {text: label.name, styles};
              }),
        }
      },
    },
  ],
]);
