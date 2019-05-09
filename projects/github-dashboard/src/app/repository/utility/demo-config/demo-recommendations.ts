export const DEMO_RECOMMENDATIONS = [
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
    actionType: 'none',
    action: null,
    filtererState: {
      filters: [
        {id: 'labels', type: 'text', value: 'feature', equality: 'notContains'},
        {id: 'state', type: 'state', state: 'open', equality: 'is'}
      ],
      search: 'Please describe the feature you would like to request.'
    },
    id: '4091fd646a9c3',
    dbAdded: '2019-05-09T04:56:14.967Z',
    dbModified: '2019-05-09T04:56:14.967Z'
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
    id: '64f5276d8b46',
    dbAdded: '2019-05-09T04:53:28.250Z',
    dbModified: '2019-05-09T04:53:28.250Z'
  }
];
