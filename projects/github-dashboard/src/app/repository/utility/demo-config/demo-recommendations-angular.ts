export const DEMO_RECOMMENDATIONS_COMPONENTS = [
  {
    message: 'This mentions accessibility',
    type: 'suggestion',
    dataType: 'issue',
    actionType: 'add-label',
    action: {labels: ['a11y']},
    filtererState: {
      filters: [
        {id: 'state', type: 'state', state: 'open', equality: 'is'},
        {id: 'labels', type: 'text', value: 'a11y', equality: 'notContains'}
      ],
      search: ' a11y  OR  accessibility '
    },
    id: '2aee59f85c451',
    dbAdded: '2019-05-09T04:56:49.859Z',
    dbModified: '2019-05-09T04:57:19.950Z'
  },
  {
    message: 'This uses the feature request issue template',
    type: 'suggestion',
    dataType: 'issue',
    actionType: 'add-label',
    action: {labels: ['feature']},
    filtererState: {
      filters: [
        {id: 'labels', type: 'text', value: 'feature', equality: 'notContains'},
        {id: 'state', type: 'state', state: 'open', equality: 'is'}
      ],
      search: 'Please describe the feature you would like to request.'
    },
  },
  {
    message: 'This issue needs a priority',
    type: 'warning',
    dataType: 'issue',
    actionType: 'add-label',
    action: {labels: ['P0', 'P1', 'P2', 'P3', 'P4', 'P5']},
    filtererState: {
      filters: [
        {
          id: 'labels',
          type: 'text',
          value: 'P0 AND P1 AND P2 AND P3 AND P4 AND P5',
          equality: 'notContains'
        },
        {id: 'state', type: 'state', state: 'open', equality: 'is'}
      ],
      search: ''
    },
  },
  {
    name: 'Needs Labels',
    view: 'list',
    dataType: 'issue',
    viewerState: {views: ['title', 'reporter', 'state', 'updatedDate', 'labels']},
    filtererState: {
      filters: [
        {id: 'recommendation', type: 'state', state: 'at least one warning', equality: 'is'}
      ],
      search: ''
    },
    grouperState: {group: 'all'},
    sorterState: {sort: 'created', reverse: true},
    group: 'Triage',
    dbModified: '2020-05-06T17:09:23.599Z'
  }
];
