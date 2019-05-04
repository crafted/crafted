import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {DataResources} from '@crafted/data';
import {Observable} from 'rxjs';
import {delay, map, mergeMap} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {Query} from '../services/dao/config/query';
import {PageNavigator} from '../services/page-navigator';
import {HeaderContentAction} from '../shared/header-content/header-content';

interface QueryListItem {
  id: string;
  name: string;
  type: string;
  count: Observable<number>;
}

interface QueryGroup {
  queries: QueryListItem[];
  name: string;
}

type QueriesPageAction = 'create';

const HEADER_ACTIONS: HeaderContentAction<QueriesPageAction>[] = [
  {
    id: 'create',
    isPrimary: true,
    text: 'Create New Query',
  },
];

@Component({
  styleUrls: ['queries-page.scss'],
  templateUrl: 'queries-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueriesPage {
  queries = this.activeStore.state.pipe(mergeMap(repoState => repoState.queriesDao.list));
  dataTypes: string[] = [];
  headerActions: Observable<HeaderContentAction[]> =
    this.queries.pipe(map(queries => queries.length ? HEADER_ACTIONS : []));

  constructor(
    @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>,
    private router: Router, private activeStore: ActiveStore, private pageNavigator: PageNavigator) {
    this.dataResourcesMap.forEach(d => this.dataTypes.push(d.type));
  }

  queryGroups = this.queries.pipe(map(queries => this.getSortedGroups(queries)));

  queryKeyTrackBy = (_i: number, itemQuery: Query) => itemQuery.id;

  createQuery() {
    this.pageNavigator.navigateToQuery();
  }

  navigateToQuery(id: string) {
    this.pageNavigator.navigateToQuery(id);
  }

  handleHeaderAction(action: QueriesPageAction) {
    if (action === 'create') {
      this.createQuery();
    }
  }

  private getQueryCount(query: Query): Observable<number> {
    const dataSourceProvider = this.dataResourcesMap.get(query.dataType);
    const filterer = dataSourceProvider.filterer(query.filtererState);
    const dataSource = dataSourceProvider.dataSource();

    return dataSource.data.pipe(filterer.filter(), delay(250), map(result => result.length));
  }

  private getSortedGroups(queries: Query[]) {
    const groups = new Map<string, QueryListItem[]>();
    queries.forEach(query => {
      const group = query.group || 'Other';
      if (!groups.has(group)) {
        groups.set(group, []);
      }

      groups.get(group).push({
        id: query.id,
        name: query.name,
        count: this.getQueryCount(query),
        type: query.dataType,
      });
    });

    const sortedGroups: QueryGroup[] = [];
    Array.from(groups.keys()).sort().forEach(group => {
      const groupQueries = groups.get(group);
      groupQueries.sort((a, b) => (a.name < b.name) ? -1 : 1);
      sortedGroups.push({name: group, queries: groupQueries});
    });

    return sortedGroups;
  }
}
