import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, Input, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Filterer} from 'projects/github-dashboard/src/app/data';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ACTION_TYPES, Recommendation, RECOMMENDATION_TYPES} from '../../../model/recommendation';
import {DATA_RESOURCES_MAP, DataResources} from '../../../repository';
import {RecommendationDialog} from '../../../shared/dialog/recommendation/recommendation-dialog';
import {AppState} from '../../../store';
import {NavigateToQuery, NavigateToQueryType} from '../../../store/query/query.action';
import {CreateRecommendation} from '../../../store/recommendation/recommendation.action';

const equalityToString = {
  notContains: `does not contain`,
  notIs: 'is not',
  greaterThan: 'is greater than',
  lessThan: 'is less than',
  equalTo: 'is equal to',
};

@Component({
  selector: 'recommendation-view',
  styleUrls: ['recommendation-view.scss'],
  templateUrl: 'recommendation-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationView {
  actionTypes = ACTION_TYPES;

  recommendationTypes = RECOMMENDATION_TYPES;

  filtererString: Observable<string>;

  resultsCount: Observable<number|string>;

  @Input() recommendation: Recommendation;

  constructor(
    private store: Store<AppState>, private recommendationDialog: RecommendationDialog,
    private router: Router, private activatedRoute: ActivatedRoute,
    @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.recommendation && this.recommendation) {
      const provider = this.dataResourcesMap.get(this.recommendation.dataType);
      const filterer = provider.filterer(this.recommendation.filtererState);
      this.resultsCount = provider.dataSource().data.pipe(
          filterer.filter(), map(items => items.length), startWith('...'));
      this.filtererString = getFiltererString(filterer);
    }
  }

  edit() {
    this.recommendationDialog.edit(this.recommendation, this.dataResourcesMap);
  }

  duplicate() {
    const newRecommendation = {...this.recommendation};
    delete newRecommendation.id;
    this.store.dispatch(new CreateRecommendation({recommendation: newRecommendation}));
  }

  remove() {
    this.recommendationDialog.remove(this.recommendation);
  }

  open() {
    this.store.dispatch(new NavigateToQuery({
      type: NavigateToQueryType.BY_JSON,
      query: {
        name: this.recommendation.message,
        dataType: this.recommendation.dataType,
        filtererState: this.recommendation.filtererState,
      }
    }));
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

      const equality = equalityToString[filter.equality] || filter.equality;
      switch (filter.type) {
        case 'text':
          str += `${filter.id} ${equality} "${filter.value}"`;
          break;
        case 'number':
          str += `${filter.id} ${equality} ${filter.value}`;
          break;
        case 'date':
          const datePipe = new DatePipe('en-us');
          str += `${filter.id} ${equality} ${datePipe.transform(filter.date)}`;
          break;
        case 'state':
          str += `${filter.id} ${equality} ${filter.state}`;
          break;
      }
    });

    return str;
  }));
}
