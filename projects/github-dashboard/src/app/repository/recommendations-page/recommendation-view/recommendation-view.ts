
import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, Input, SimpleChanges} from '@angular/core';
import {
  DataResources,
  DateQuery,
  FiltererState,
  InputQuery,
  NumberQuery,
  StateQuery
} from '@crafted/data';
import {FiltererMetadata} from 'projects/data/src/public-api';
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

  filtererString: string;

  @Input() recommendation: Recommendation;

  constructor(
      private recommendationDialog: RecommendationDialog, private activeRepo: ActiveStore,
      @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['recommendation'] && this.recommendation) {
      const state = this.recommendation.filtererState;
      const metadata = this.dataResourcesMap.get(this.recommendation.data).filterer().metadata;
      this.filtererString = getFiltererString(state, metadata);
    }
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

function getFiltererString(state: FiltererState, metadata: Map<string, FiltererMetadata>): string {
  let str = '';

  if (state.search) {
    str += `Search: "${state.search}"`;
  }

  state.filters.forEach(filter => {
    if (str) {
      str += ', ';
    }

    const equality = equalityToString[filter.query.equality] || filter.query.equality;
    switch (metadata.get(filter.type).queryType) {
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
