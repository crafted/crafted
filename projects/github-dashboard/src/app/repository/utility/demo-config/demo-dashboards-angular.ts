import {Dashboard} from 'projects/github-dashboard/src/app/components';

export const DEMO_DASHBOARDS_ANGULAR: Partial<Dashboard>[] = [{
  id: 'dashboard1',
  name: 'Issues Overview',
  columnGroups: [
    {
      columns: [
        {
          widgets: [{
            title: 'Open Issues',
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
                actions: [
                  {datePropertyId: 'opened', countPropertyId: 'count', type: 'increment'},
                  {datePropertyId: 'closed', countPropertyId: 'count', type: 'decrement'}
                ],
                dataType: 'issue',
                filtererState: null
              }]
            }
          }]
        },
        {
          widgets: [{
            title: 'Opened/Closed Issues',
            type: 'timeSeries',
            options: {
              dataType: null,
              start: null,
              end: null,
              group: 'month',
              datasets: [
                {
                  label: 'Opened Issues',
                  color: '',
                  seriesType: 'count',
                  actions: [
                    {datePropertyId: 'opened', countPropertyId: 'count', type: 'increment'}
                  ],
                  dataType: 'issue',
                  filtererState: null
                },
                {
                  label: 'Closed Issues',
                  color: '',
                  seriesType: 'count',
                  actions: [
                    {datePropertyId: 'closed', countPropertyId: 'count', type: 'increment'}
                  ],
                  dataType: 'issue',
                  filtererState: null
                }
              ]
            }
          }]
        }
      ]
    },
    {
      columns: [
        {
          widgets: [{
            title: 'Feature Requests',
            type: 'count',
            options: {
              dataType: 'issue',
              valueProperty: 'count',
              fontSize: 48,
              filtererState: {
                filters: [
                  {
                    id: 'labels',
                    type: 'text',
                    value: 'type: feature',
                    equality: 'contains'
                  },
                  {id: 'state', type: 'state', state: 'open', equality: 'is'}
                ],
                search: ''
              }
            }
          }]
        },
        {
          widgets: [{
            title: '',
            type: 'pie',
            options: {
              dataType: 'issue',
              grouperState: {group: 'label'},
              filteredGroups: 'type: feature, type: bug/fix',
              filtererState: {
                filters: [{id: 'state', type: 'state', state: 'open', equality: 'is'}],
                search: ''
              }
            }
          }]
        },
        {
          widgets: [{
            title: 'Bug/Fix',
            type: 'count',
            options: {
              dataType: 'issue',
              valueProperty: 'count',
              fontSize: 48,
              filtererState: {
                filters: [
                  {id: 'state', type: 'state', state: 'open', equality: 'is'},
                  {id: 'labels', type: 'text', value: 'type: bug/fix', equality: 'contains'}
                ],
                search: ''
              }
            }
          }]
        }
      ]
    }
  ],
  description: 'Widgets showing an overview of angular/angular\'s issues\n'
}];
