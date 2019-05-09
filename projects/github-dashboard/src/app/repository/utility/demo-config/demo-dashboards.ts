export const DEMO_DASHBOARDS = [
  {
    name: 'andrewseguin',
    columnGroups: [{
      columns: [
        {
          widgets: [
            {
              title: 'Number of Assigned Issues',
              type: 'count',
              options: {
                dataType: 'issue',
                fontSize: 48,
                filtererState: {
                  filters: [
                    {
                      id: 'assignees',
                      type: 'text',
                      value: 'andrewseguin',
                      equality: 'contains'
                    },
                    {id: 'state', type: 'state', state: 'open', equality: 'is'}
                  ],
                  search: ''
                }
              }
            },
            {
              title: '',
              type: 'list',
              options: {
                dataType: 'issue',
                listLength: 10,
                sorterState: {sort: 'plusOneReactions', reverse: true},
                viewerState: null,
                filtererState: {
                  filters: [
                    {
                      id: 'assignees',
                      type: 'text',
                      value: 'andrewseguin',
                      equality: 'contains'
                    },
                    {id: 'state', type: 'state', state: 'open', equality: 'is'}
                  ],
                  search: ''
                }
              }
            }
          ]
        },
        {
          widgets: [
            {
              title: 'Number of Assigned PRs',
              type: 'count',
              options: {
                dataType: 'pr',
                fontSize: 48,
                filtererState: {
                  filters: [
                    {
                      id: 'assignees',
                      type: 'text',
                      value: 'andrewseguin',
                      equality: 'contains'
                    },
                    {id: 'state', type: 'state', state: 'open', equality: 'is'}
                  ],
                  search: ''
                }
              }
            },
            {
              title: '',
              type: 'list',
              options: {
                dataType: 'pr',
                listLength: 10,
                sorterState: {sort: 'plusOneReactions', reverse: true},
                viewerState: null,
                filtererState: {
                  filters: [
                    {
                      id: 'assignees',
                      type: 'text',
                      value: 'andrewseguin',
                      equality: 'contains'
                    },
                    {id: 'state', type: 'state', state: 'open', equality: 'is'}
                  ],
                  search: ''
                }
              }
            }
          ]
        }
      ]
    }],
    id: '0cca8bd6e2e9c',
    dbAdded: '2019-05-08T23:57:49.258Z',
    dbModified: '2019-05-08T23:58:45.427Z',
    description: 'Top issues and pull requests currently assigned to andrewseguin\n'
  },
  {
    id: '130346b1570a1',
    name: 'Issues Overview',
    description:
        'Shows an overview of how many issues are open, their priorities, and the latest updated issues',
    dbAdded: '2019-05-08T23:47:18.601Z',
    dbModified: '2019-05-09T04:25:45.921Z',
    columnGroups: [{
      columns: [
        {
          widgets: [
            {
              title: 'Number of Issues Opened/Closed',
              type: 'timeSeries',
              options: {
                dataType: null,
                start: null,
                end: null,
                group: 'month',
                datasets: [
                  {
                    label: 'Opened',
                    color: '',
                    seriesType: 'count',
                    actions: [{datePropertyId: 'opened', type: 'increment'}],
                    dataType: 'issue',
                    filtererState: null
                  },
                  {
                    label: 'Closed',
                    color: '',
                    seriesType: 'count',
                    actions: [{datePropertyId: 'closed', type: 'increment'}],
                    dataType: 'issue',
                    filtererState: null
                  }
                ]
              }
            },
            {
              title: 'Number of Open Issues',
              type: 'timeSeries',
              options: {
                dataType: null,
                start: null,
                end: null,
                group: 'month',
                datasets: [{
                  label: '',
                  color: '',
                  seriesType: 'accumulate',
                  actions: [{datePropertyId: 'opened', type: 'increment'}],
                  dataType: 'issue',
                  filtererState: null
                }]
              }
            }
          ]
        },
        {
          widgets: [
            {
              title: 'Number of Open Issues',
              type: 'count',
              options: {
                dataType: 'issue',
                fontSize: 96,
                filtererState: {
                  filters: [{id: 'state', type: 'state', state: 'open', equality: 'is'}],
                  search: ''
                }
              }
            },
            {
              title: 'Issue Priorities',
              type: 'pie',
              options: {
                dataType: 'issue',
                grouperState: {group: 'label'},
                filteredGroups: 'P0, P1, P2, P3, P4, P5',
                filtererState: {
                  filters: [{id: 'state', type: 'state', state: 'open', equality: 'is'}],
                  search: ''
                }
              }
            },
            {
              title: 'Issue Assignees',
              type: 'pie',
              options: {
                dataType: 'issue',
                grouperState: {group: 'assignee'},
                filteredGroups: null,
                filtererState: {
                  filters: [{id: 'state', type: 'state', state: 'open', equality: 'is'}],
                  search: ''
                }
              }
            },
            {
              title: 'Untriaged Issues',
              type: 'count',
              options: {
                dataType: 'issue',
                fontSize: 48,
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
                }
              }
            }
          ]
        }
      ]
    }]
  },
  {
    name: 'High Priority Issues Lists',
    columnGroups: [{
      columns: [
        {
          widgets: [{
            title: 'Open Issues Sorted by +1 Count',
            type: 'list',
            options: {
              dataType: 'issue',
              listLength: 20,
              sorterState: {sort: 'plusOneReactions', reverse: true},
              viewerState: null,
              filtererState: {
                filters: [{id: 'state', type: 'state', state: 'open', equality: 'is'}],
                search: ''
              }
            }
          }]
        },
        {
          widgets: [{
            title: 'P2 Open Issues by Googlers',
            type: 'list',
            options: {
              dataType: 'issue',
              listLength: 20,
              sorterState: {sort: 'created', reverse: false},
              viewerState: null,
              filtererState: {
                filters: [
                  {id: 'labels', type: 'text', value: 'G AND P2', equality: 'contains'},
                  {id: 'state', type: 'state', state: 'open', equality: 'is'}
                ],
                search: ''
              }
            }
          }]
        },
        {
          widgets: [{
            title: 'Open Issues Sorted by Most Activity',
            type: 'list',
            options: {
              dataType: 'issue',
              listLength: 20,
              sorterState: {sort: 'comments', reverse: true},
              viewerState: null,
              filtererState: {
                filters: [{id: 'state', type: 'state', state: 'open', equality: 'is'}],
                search: ''
              }
            }
          }]
        }
      ]
    }],
    id: '204d016d0d011',
    dbAdded: '2019-05-08T23:54:22.868Z',
    dbModified: '2019-05-08T23:55:02.690Z',
    description: 'Several lists of issues that are considered high priority'
  }
];
