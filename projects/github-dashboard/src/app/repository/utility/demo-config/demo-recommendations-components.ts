export const DEMO_RECOMMENDATIONS_ANGULAR = [{
  message: 'Needs triage',
  type: 'warning',
  dataType: 'issue',
  actionType: 'add-label',
  action: {
    labels: [
      'comp: animations',
      'comp: bazel',
      'comp: benchpress',
      'comp: build & ci',
      'comp: common',
      'comp: common/http',
      'comp: core',
      'comp: forms',
      'comp: testing',
      'comp: migrations',
      'comp: http',
      'comp: router',
      'comp: server',
      'comp: ts-api-guardian',
      'comp: i18n',
      'comp: zones',
      'comp: performance',
      'comp: ngcc',
      'comp: docs-infra',
      'comp: packaging',
      'comp: upgrade',
      'comp: compiler',
      'comp: dev-infra',
      'comp: docs',
      'comp: ivy',
      'comp: ngbot',
      'comp: service-worker',
      'comp: language-service',
      'comp: examples',
      'comp: ve',
      'comp: docs/api',
      'comp: elements',
      'comp: security',
      'comp: web-worker'
    ]
  },
  filtererState: {
    filters: [
      {id: 'labels', type: 'text', value: '', equality: 'is'},
      {id: 'state', type: 'state', state: 'open', equality: 'is'}
    ],
    search: ''
  }
}];
