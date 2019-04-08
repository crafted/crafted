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
      containerClassList: 'title theme-text',
      containerStyles: {
        marginBottom: '4px',
        fontSize: '15px',
      },
      renderParts: (c: ViewContext) => [{
        text: c.item.title,
      }],
    },
  ],

  [
    'reporter',
    {
      label: 'Reporter',
      containerStyles: {fontSize: '13px'},
      containerClassList: 'theme-secondary-text',
      renderParts: (c: ViewContext) => [{
        text: `Reporter: ${c.item.reporter}`,
      }],
    },
  ],

  [
    'creationDate',
    {
      label: 'Date Created',
      containerStyles: {fontSize: '13px'},
      containerClassList: 'theme-secondary-text',
      renderParts: (c: ViewContext) => {
        const datePipe = new DatePipe('en-us');
        return [
          {text: `Created: ${datePipe.transform(c.item.created)}`},
        ];
      },
    },
  ],

  [
    'updatedDate',
    {
      label: 'Date Last Updated',
      containerStyles: {fontSize: '13px'},
      containerClassList: 'theme-secondary-text',
      renderParts: (c: ViewContext) => {
        const datePipe = new DatePipe('en-us');
        return [{
          text: `Last updated: ${datePipe.transform(c.item.updated)}`,
        }];
      },
    },
  ],

  [
    'assignees',
    {
      label: 'Assignees',
      containerStyles: {fontSize: '13px'},
      containerClassList: 'theme-secondary-text',
      renderParts: (c: ViewContext) => {
        if (!c.item.assignees.length) {
          return [];
        }
        return [{
          text: `Assignees: ${c.item.assignees.join(',')}`,
        }];
      }
    },
  ],

  [
    'suggestions',
    {
      label: 'Suggestions',
      containerStyles: {fontSize: '13px'},
      containerClassList: 'theme-secondary-text',
      renderParts: (c: ViewContext) => {
        const allSuggestions = c.recommendations.filter(r => r.type === 'suggestion');
        const suggestions = getRecommendations(c.item, allSuggestions, c.labelsMap);
        return suggestions.map(r => ({text: r.message || ''}));
      },
    },
  ],

  [
    'warnings',
    {
      label: 'Warnings',
      containerStyles: {fontSize: '13px'},
      containerClassList: 'theme-warn',
      renderParts: (c: ViewContext) => {
        const allWarnings = c.recommendations.filter(r => r.type === 'warning');
        const warnings = getRecommendations(c.item, allWarnings, c.labelsMap);
        return warnings.map(r => ({text: r.message || ''}));
      },
    },
  ],

  [
    'labels',
    {
      label: 'Labels',
      containerStyles: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        fontSize: '13px',
        marginTop: '8px',
      },
      renderParts: (c: ViewContext) => {
        return c.item.labels.map(id => {
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
        });
      },
    },
  ],
]);
