import {CdkPortal} from '@angular/cdk/portal';
import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataResources, FiltererState, NumberQuery} from '@crafted/data';
import {DateQuery, InputQuery, StateQuery} from 'projects/data/src/lib/query';
import {combineLatest, Subject} from 'rxjs';
import {map, mergeMap, startWith, takeUntil} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {
  ActionTypes,
  Recommendation,
  RecommendationTypes
} from '../services/dao/config/recommendation';
import {Header} from '../services/header';
import {RecommendationDialog} from '../shared/dialog/recommendation/recommendation-dialog';

@Component({
  selector: 'recommendations-page',
  styleUrls: ['recommendations-page.scss'],
  templateUrl: 'recommendations-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsPage {
  actionTypes = ActionTypes;

  recommendationTypes = RecommendationTypes;

  filter = new FormControl('');

  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  recommendations = this.activeRepo.config.pipe(mergeMap(store => store.recommendations.list));

  sortedRecommendations =
      combineLatest(this.recommendations, this.filter.valueChanges.pipe(startWith('')))
          .pipe(map(result => {
            const filtered = result[0].filter(r => this.matchesFilter(r));
            return filtered.sort((a, b) => (a.dbAdded! > b.dbAdded!) ? -1 : 1);
          }));
  trackById = (_i: number, r: Recommendation) => r.id;

  constructor(
      @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>,
      private header: Header, private activeRepo: ActiveStore,
      private recommendationDialog: RecommendationDialog) {}

  ngOnInit() {
    this.sortedRecommendations.pipe(takeUntil(this.destroyed)).subscribe(list => {
      if (list.length) {
        this.header.toolbarOutlet.next(this.toolbarActions);
      } else {
        this.header.toolbarOutlet.next(null);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.header.toolbarOutlet.next(null);
  }


  add() {
    this.recommendationDialog.create(
        this.activeRepo.activeConfig, this.activeRepo.activeData, this.dataResourcesMap);
  }

  matchesFilter(recommendation: Recommendation) {
    const values: any[] = [];
    Object.keys(recommendation)
        .forEach(key => values.push(JSON.stringify((recommendation as any)[key] as any)));
    return values.join(';').toLowerCase().indexOf(this.filter.value.toLowerCase()) != -1;
  }

  filtererStateToString(filtererState: FiltererState, dataType: string) {
    let str = '';

    if (filtererState.search) {
      str += `Search: "${filtererState.search}"`;
    }

    const equalityToString = {
      'notContains': `does not contain`,
      'notIs': 'is not',
      'greaterThan': 'is greater than',
      'lessThan': 'is less than',
      'equalTo': 'is equal to',
    };

    filtererState.filters.forEach(filter => {
      if (str) {
        str += ', ';
      }

      const filterer = this.dataResourcesMap.get(dataType).filterer();
      const equality = equalityToString[filter.query.equality] || filter.query.equality;
      switch (filterer.metadata.get(filter.type).queryType) {
        case 'input':
          const inputQuery = filter.query as InputQuery;
          str += `${filter.type} ${equality} "${inputQuery.input}"`;
          break;
        case 'number':
          const numberQuery = filter.query as NumberQuery;
          str += `${filter.type} ${equality} ${numberQuery.value}`;
          break;
        case 'date':
          const datePipe = new DatePipe('en-us');
          const dateQuery = filter.query as DateQuery;
          str += `${filter.type} ${equality} ${datePipe.transform(dateQuery.date)}`;
          break;
        case 'state':
          const stateQuery = filter.query as StateQuery;
          str += `${filter.type} ${equality} ${stateQuery.state}`;
          break;
      }
    });

    return str;
  }

  edit(recommendation: Recommendation) {
    this.recommendationDialog.edit(
        recommendation, this.activeRepo.activeConfig, this.activeRepo.activeData,
        this.dataResourcesMap);
  }

  duplicate(recommendation: Recommendation) {
    const newRecommendation = {...recommendation};
    delete newRecommendation.id;
    this.activeRepo.activeConfig.recommendations.add(newRecommendation);
  }

  remove(recommendation: Recommendation) {
    this.recommendationDialog.remove(recommendation, this.activeRepo.activeConfig);
  }
}
