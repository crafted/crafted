import {
  dateMatchesEquality,
  Filterer,
  FiltererContextProvider,
  FiltererMetadata,
  FiltererState,
  numberMatchesEquality,
  stateMatchesEquality,
  textArrayMatchesEquality,
  textMatchesEquality
} from 'projects/github-dashboard/src/app/data';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Recommendation} from '../../repository/model/recommendation';
import {Item} from '../app-types/item';
import {Label} from '../app-types/label';
import {createLabelsMap} from '../utility/create-labels-map';
import {tokenizeItem} from '../utility/tokenize-item';

interface MatcherContext {
  labelsMap: Map<string, Label>;
  getRecommendations: (item) => Recommendation[];
}

function createFiltererContextProvider(
    labels$: Observable<Label[]>, recommendations$: Observable<Recommendation[]>,
    getRecommendations: (item, recommendations: Recommendation[], labelsMap: Map<string, Label>) =>
        Recommendation[]): FiltererContextProvider<MatcherContext> {
  return combineLatest(recommendations$, labels$).pipe(map(([recommendations, labels]) => {
    const labelsMap = createLabelsMap(labels);
    return {
      labelsMap,
      getRecommendations: (item) => getRecommendations(item, recommendations, labelsMap)
    };
  }));
}

export const ITEM_FILTERER_METADATA = new Map<string, FiltererMetadata<Item, MatcherContext>>([

  /** InputQuery Filters */

  [
    'title', {
      label: 'Title',
      type: 'text',
      matcher: (item, filter) => textMatchesEquality(item.title, filter.value, filter.equality),
      autocomplete: items => items.map(issue => issue.title)
    }
  ],

  [
    'assignees', {
      label: 'Assignee',
      type: 'text',
      matcher: (item, filter) =>
          textArrayMatchesEquality(item.assignees, filter.value, filter.equality),
      autocomplete: items => {
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
    'reporter', {
      label: 'Reporter',
      type: 'text',
      matcher: (item, filter) => textMatchesEquality(item.reporter, filter.value, filter.equality),
      autocomplete: items => items.map(issue => issue.reporter)
    }
  ],

  [
    'body', {
      label: 'Body',
      type: 'text',
      matcher: (item, filter) => textMatchesEquality(item.body, filter.value, filter.equality),
      autocomplete: () => [],
    }
  ],

  [
    'labels', {
      label: 'Labels',
      type: 'text',
      matcher: (item, filter, context) => {
        const labelIds = item.labels.map(labelId => `${labelId}`);
        const labelNames = labelIds.map(l => {
          const label = context.labelsMap.get(l);

          if (!label) {
            return '';
          }

          return label.name;
        });
        return textArrayMatchesEquality(labelNames, filter.value, filter.equality);
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
      type: 'number',
      matcher: (item, filter) => numberMatchesEquality(item.comments, filter.value, filter.equality)
    }
  ],
  [
    'reactionCount', {
      label: 'Reaction Count',
      type: 'number',
      matcher: (item, filter) =>
          numberMatchesEquality(item.reactions['+1'], filter.value, filter.equality)
    }
  ],

  [
    'days-since-created', {
      label: 'Days Since Created',
      type: 'number',
      matcher: (item, filter) => {
        const dayInMs = 1000 * 60 * 60 * 24;
        const nowMs = new Date().getTime();
        const createdDateMs = new Date(item.created).getTime();
        const days = Math.round(Math.abs(nowMs - createdDateMs) / dayInMs);

        return numberMatchesEquality(days, filter.value, filter.equality);
      }
    }
  ],

  [
    'days-since-updated', {
      label: 'Days Since Updated',
      type: 'number',
      matcher: (item, filter) => {
        const dayInMs = 1000 * 60 * 60 * 24;
        const nowMs = new Date().getTime();
        const createdDateMs = new Date(item.updated).getTime();
        const days = Math.round(Math.abs(nowMs - createdDateMs) / dayInMs);

        return numberMatchesEquality(days, filter.value, filter.equality);
      }
    }
  ],

  [
    'days-open', {
      label: 'Days Open',
      type: 'number',
      matcher: (item, filter) => {
        const dayInMs = 1000 * 60 * 60 * 24;

        // If item has not yet been closed, use current time
        const closedDateMs = new Date(item.closed).getTime() || new Date().getTime();
        const createdDateMs = new Date(item.created).getTime();
        const days = Math.round(Math.abs(closedDateMs - createdDateMs) / dayInMs);

        return numberMatchesEquality(days, filter.value, filter.equality);
      }
    }
  ],

  /** DateQuery Filters */

  [
    'created', {
    label: 'Date Created',
    type: 'date',
    matcher: (item, filter) => {
      return dateMatchesEquality(item.created, filter.date, filter.equality);
    }
  }
  ],

  /** DateQuery Filters */

  [
    'closed', {
    label: 'Date Closed',
    type: 'date',
    matcher: (item, filter) => {
      return dateMatchesEquality(item.closed, filter.date, filter.equality);
    }
  }
  ],

  /** StateQuery */

  [
    'state', {
      label: 'State',
      type: 'state',
      states: ['open', 'closed'],
      matcher: (item, filter) => {
        const values = new Map<string, boolean>([
          ['open', item.state === 'open'],
          ['closed', item.state === 'closed'],
        ]);
        return stateMatchesEquality(values.get(filter.state), filter.state, filter.equality);
      },
    }
  ],

  [
    'recommendation', {
      label: 'Recommendation',
      type: 'state',
      states: ['empty', 'at least one warning', 'at least one suggestion'],
      matcher: (item, filter, context) => {
        const recommendations = context.getRecommendations(item);
        const values = new Map<string, boolean>([
          ['empty', !recommendations.length],
          ['at least one warning', recommendations.some(r => r.type === 'warning')],
          ['at least one suggestion', recommendations.some(r => r.type === 'suggestion')],
        ]);
        return stateMatchesEquality(values.get(filter.state), filter.state, filter.equality);
      },
    }
  ],
]);

export function getFiltererProvider(
    labels: Observable<Label[]>, recommendations: Observable<Recommendation[]>,
    getRecommendations: (item, recommendations: Recommendation[], labelsMap: Map<string, Label>) =>
        Recommendation[]): (initialState?: FiltererState) => Filterer<any, any> {
  return (initialState?: FiltererState) => {
    const contextProvider =
        createFiltererContextProvider(labels, recommendations, getRecommendations);
    return new Filterer(
        {metadata: ITEM_FILTERER_METADATA, contextProvider, initialState, tokenizeItem});
  };
}
