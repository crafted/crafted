import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Query} from '../model/query';
import {DATA_RESOURCES_MAP, DataResources} from '../repository';
import {HeaderContentAction} from '../shared/header-content/header-content';
import {AppState} from '../store';
import {NavigateToQuery, NavigateToQueryType} from '../store/query/query.action';
import {selectQueryList} from '../store/query/query.reducer';

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
  queries = this.store.select(selectQueryList);
  dataTypes: string[] = [];
  headerActions: Observable<HeaderContentAction[]> =
      this.queries.pipe(map(queries => queries.length ? HEADER_ACTIONS : []));

  constructor(
      private store: Store<AppState>,
      @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>) {
    this.dataResourcesMap.forEach(d => this.dataTypes.push(d.type));
  }

  queryGroups = this.queries.pipe(map(queries => this.getSortedGroups(queries)));

  queryKeyTrackBy = (_i: number, itemQuery: Query) => itemQuery.id;

  createQuery() {
    this.store.dispatch(new NavigateToQuery({type: NavigateToQueryType.NEW}));
  }

  navigateToQuery(id: string) {
    this.store.dispatch(new NavigateToQuery({type: NavigateToQueryType.BY_ID, id}));
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

    return dataSource.data.pipe(filterer.filter(), map(result => result.length));
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
