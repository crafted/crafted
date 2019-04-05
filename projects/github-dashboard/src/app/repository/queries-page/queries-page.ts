import {CdkPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {delay, map, mergeMap, takeUntil} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {Query} from '../services/dao/config/query';
import {Recommendation} from '../services/dao/config/recommendation';
import {Header} from '../services/header';
import {DataResources} from '../../package/utility/data-resources';

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

@Component({
  styleUrls: ['queries-page.scss'],
  templateUrl: 'queries-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueriesPage {
  dataResourcesIds: string[] = [];

  recommendationsList =
      this.activeRepo.config.pipe(mergeMap(configStore => configStore.recommendations.list));

  queries =
      this.activeRepo.config.pipe(delay(100), mergeMap(configStore => configStore.queries.list));

  queryGroups = this.queries.pipe(map(queries => this.getSortedGroups(queries)));

  queryKeyTrackBy = (_i: number, itemQuery: Query) => itemQuery.id;

  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  constructor(
      @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>,
      private header: Header, private router: Router, private activeRepo: ActiveStore) {
    this.dataResourcesMap.forEach(dataResources => this.dataResourcesIds.push(dataResources.id));
  }

  ngOnInit() {
    this.queries.pipe(takeUntil(this.destroyed)).subscribe(list => {
      if (list.length) {
        this.header.toolbarOutlet.next(this.toolbarActions);
      } else {
        this.header.toolbarOutlet.next(null);
      }
    });
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
    this.destroyed.next();
    this.destroyed.complete();
  }

  createQuery(type: string) {
    this.router.navigate([`${this.activeRepo.activeName}/query/new`], {queryParams: {type}});
  }

  createQueryFromRecommendation(recommendation: Recommendation) {
    this.router.navigate(
        [`${this.activeRepo.activeName}/query/new`],
        {queryParams: {'recommendationId': recommendation.id}});
  }

  navigateToQuery(id: string) {
    this.router.navigate([`${this.activeRepo.activeName}/query/${id}`]);
  }

  private getQueryCount(query: Query): Observable<number> {
    const dataSourceProvider = this.dataResourcesMap.get(query.dataSourceType!)!;
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

      groups.get(group)!.push({
        id: query.id!,
        name: query.name!,
        count: this.getQueryCount(query),
        type: query.dataSourceType!,
      });
    });

    const sortedGroups: QueryGroup[] = [];
    Array.from(groups.keys()).sort().forEach(group => {
      const queries = groups.get(group)!;
      queries.sort((a, b) => (a.name! < b.name!) ? -1 : 1);
      sortedGroups.push({name: group, queries});
    });

    return sortedGroups;
  }
}
