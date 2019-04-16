
import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, Input, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  DataResources,
  DateQuery,
  Filterer,
  InputQuery,
  NumberQuery,
  StateQuery
} from '@crafted/data';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../../repository';
import {ActiveStore} from '../../services/active-store';
import {
  ActionTypes,
  Recommendation,
  RecommendationTypes
} from '../../services/dao/config/recommendation';
import {RecommendationDialog} from '../../shared/dialog/recommendation/recommendation-dialog';

const equalityToString = {
  'notContains': `does not contain`,
  'notIs': 'is not',
  'greaterThan': 'is greater than',
  'lessThan': 'is less than',
  'equalTo': 'is equal to',
};

@Component({
  selector: 'recommendation-view',
  styleUrls: ['recommendation-view.scss'],
  templateUrl: 'recommendation-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationView {
  actionTypes = ActionTypes;

  recommendationTypes = RecommendationTypes;

  filtererString: Observable<string>;

  resultsCount: Observable<number>;

  @Input() recommendation: Recommendation;

  constructor(
      private recommendationDialog: RecommendationDialog, private activeRepo: ActiveStore,
      private router: Router, private activatedRoute: ActivatedRoute,
      @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['recommendation'] && this.recommendation) {
      const provider = this.dataResourcesMap.get(this.recommendation.data);
      const filterer = provider.filterer(this.recommendation.filtererState);
      this.resultsCount =
          provider.dataSource().data.pipe(filterer.filter(), map(items => items.length));
      this.filtererString = getFiltererString(filterer);
    }
  }

  edit() {
    this.recommendationDialog.edit(
        this.recommendation, this.activeRepo.activeConfig, this.activeRepo.activeData,
        this.dataResourcesMap);
  }

  duplicate() {
    const newRecommendation = {...this.recommendation};
    delete newRecommendation.id;
    this.activeRepo.activeConfig.recommendations.add(newRecommendation);
  }

  remove() {
    this.recommendationDialog.remove(this.recommendation, this.activeRepo.activeConfig);
  }

  open() {
    this.router.navigate([`../../../${this.activeRepo.activeName}/query/new`], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {recommendationId: this.recommendation.id},
    });
  }
}

function getFiltererString(filterer: Filterer): Observable<string> {
  return filterer.state.pipe(map(state => {
    let str = '';

    if (state.search) {
      str += `Search: "${state.search}"`;
    }

    state.filters.forEach(filter => {
      if (str) {
        str += ', ';
      }

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
  }));
}
