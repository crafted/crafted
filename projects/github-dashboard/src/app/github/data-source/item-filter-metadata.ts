import {
  arrayContainsQuery,
  dateMatchesEquality,
  DateQuery,
  Filterer,
  FiltererContextProvider,
  FiltererMetadata,
  FiltererState,
  InputQuery,
  numberMatchesEquality,
  NumberQuery,
  Query,
  stateMatchesEquality,
  StateQuery,
  stringContainsQuery
} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Recommendation} from '../../repository/services/dao/config/recommendation';
import {Item} from '../app-types/item';
import {Label} from '../app-types/label';
import {createLabelsMap} from '../utility/create-labels-map';
import {tokenizeItem} from '../utility/tokenize-item';

export function getFiltererProvider(
    labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>,
    getRecommendations:
        (item: Item, recommendations: Recommendation[], labelsMap: Map<string, Label>) =>
            Recommendation[]): (initialState?: FiltererState) => Filterer<Item, MatcherContext> {
  return (initialState?: FiltererState) => {
    const filterer = new Filterer(
        ItemsFilterMetadata,
        createFiltererContextProvider(labels, recommendations, getRecommendations), initialState);
    filterer.tokenizeItem = tokenizeItem;
    return filterer;
  };
}

interface MatcherContext {
  labelsMap: Map<string, Label>;
  getRecommendations: (item: Item) => Recommendation[];
}

function createFiltererContextProvider(
    labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>,
    getRecommendations:
        (item: Item, recommendations: Recommendation[], labelsMap: Map<string, Label>) =>
            Recommendation[]): FiltererContextProvider<MatcherContext> {
  return combineLatest(recommendations, labels).pipe(map(results => {
    const labelsMap = createLabelsMap(results[1]);
    return {
      labelsMap,
      getRecommendations: (item: Item) => getRecommendations(item, results[0], labelsMap)
    };
  }));
}

export const ItemsFilterMetadata = new Map<string, FiltererMetadata<Item, MatcherContext>>([

  /** InputQuery Filters */

  [
    'title', {
      label: 'Title',
      queryType: 'input',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        return stringContainsQuery(item.title, q as InputQuery);
      },
      autocomplete: (items: Item[]) => {
        return items.map(issue => issue.title);
      }
    }
  ],

  [
    'assignees', {
      label: 'Assignee',
      queryType: 'input',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        return arrayContainsQuery(item.assignees, q as InputQuery);
      },
      autocomplete: (items: Item[]) => {
        const assigneesSet = new Set<string>();
        items.forEach(item => item.assignees.forEach(a => assigneesSet.add(a)));

        const assignees: string[] = [];
        assigneesSet.forEach(a => assignees.push(a));
        assignees.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
        return assignees;
      }
    }
  ],

  [
    'body', {
      label: 'Body',
      queryType: 'input',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        return stringContainsQuery(item.body, q as InputQuery);
      },
    }
  ],

  [
    'labels', {
      label: 'Labels',
      queryType: 'input',
      matcher: (item: Item, q: Query, c: MatcherContext) => {
        const labelIds = item.labels.map(labelId => `${labelId}`);
        return arrayContainsQuery(
            labelIds.map(l => {
              const label = c.labelsMap.get(l);

              if (!label) {
                return '';
              }

              return label.name;
            }),
            q as InputQuery);
      },
      autocomplete: (_items: Item[], c: MatcherContext) => {
        const labelNames: string[] = [];
        c.labelsMap.forEach(label => labelNames.push(label.name));

        return labelNames.sort();
      }
    }
  ],

  /** NumberQuery Filters */

  [
    'commentCount', {
      label: 'Comment Count',
      queryType: 'number',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        return numberMatchesEquality(item.comments, q as NumberQuery);
      }
    }
  ],
  [
    'reactionCount', {
      label: 'Reaction Count',
      queryType: 'number',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        return numberMatchesEquality(item.reactions['+1'], q as NumberQuery);
      }
    }
  ],

  [
    'days-since-created', {
      label: 'Days Since Created',
      queryType: 'number',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        const dayInMs = 1000 * 60 * 60 * 24;
        const nowMs = new Date().getTime();
        const createdDateMs = new Date(item.created).getTime();
        const days = Math.round(Math.abs(nowMs - createdDateMs) / dayInMs);

        return numberMatchesEquality(days, q as NumberQuery);
      }
    }
  ],

  [
    'days-since-updated', {
      label: 'Days Since Updated',
      queryType: 'number',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        const dayInMs = 1000 * 60 * 60 * 24;
        const nowMs = new Date().getTime();
        const createdDateMs = new Date(item.updated).getTime();
        const days = Math.round(Math.abs(nowMs - createdDateMs) / dayInMs);

        return numberMatchesEquality(days, q as NumberQuery);
      }
    }
  ],

  [
    'days-open', {
      label: 'Days Open',
      queryType: 'number',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        const dayInMs = 1000 * 60 * 60 * 24;

        // If item has not yet been closed, use current time
        const closedDateMs = new Date(item.closed).getTime() || new Date().getTime();
        const createdDateMs = new Date(item.created).getTime();
        const days = Math.round(Math.abs(closedDateMs - createdDateMs) / dayInMs);

        return numberMatchesEquality(days, q as NumberQuery);
      }
    }
  ],

  /** DateQuery Filters */

  [
    'created', {
      label: 'Date Created',
      queryType: 'date',
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        return dateMatchesEquality(item.created, q as DateQuery);
      }
    }
  ],

  /** StateQuery */

  [
    'state', {
      label: 'State',
      queryType: 'state',
      queryTypeData: {
        states: [
          'open',
          'closed',
        ],
      },
      matcher: (item: Item, q: Query, _c: MatcherContext) => {
        const values = new Map<string, boolean>([
          ['open', item.state === 'open'],
          ['closed', item.state === 'closed'],
        ]);
        const stateQuery = q as StateQuery;
        return stateMatchesEquality(values.get(stateQuery.state)!, stateQuery);
      },
    }
  ],

  [
    'recommendation', {
      label: 'Recommendation',
      queryType: 'state',
      queryTypeData: {
        states: [
          'empty',
          'at least one warning',
          'at least one suggestion',
        ],
      },
      matcher: (item: Item, q: Query, c: MatcherContext) => {
        const recommendations = c.getRecommendations(item);
        const values = new Map<string, boolean>([
          ['empty', !recommendations.length],
          ['at least one warning', recommendations.some(r => r.type === 'warning')],
          ['at least one suggestion', recommendations.some(r => r.type === 'suggestion')],
        ]);
        const stateQuery = q as StateQuery;
        return stateMatchesEquality(values.get(stateQuery.state)!, stateQuery);
      },
    }
  ],
]);
