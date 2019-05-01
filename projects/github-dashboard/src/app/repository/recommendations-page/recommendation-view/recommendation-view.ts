import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Inject, Input, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataResources, Filterer} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../../repository';
import {ActiveStore} from '../../services/active-store';
import {
  ACTION_TYPES,
  Recommendation,
  RECOMMENDATION_TYPES
} from '../../services/dao/config/recommendation';
import {RecommendationDialog} from '../../shared/dialog/recommendation/recommendation-dialog';

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

  resultsCount: Observable<number>;

  @Input() recommendation: Recommendation;

  constructor(
    private recommendationDialog: RecommendationDialog, private activeStore: ActiveStore,
    private router: Router, private activatedRoute: ActivatedRoute,
    @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>) {
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.recommendation && this.recommendation) {
      const provider = this.dataResourcesMap.get(this.recommendation.dataType);
      const filterer = provider.filterer(this.recommendation.filtererState);
      this.resultsCount =
          provider.dataSource().data.pipe(filterer.filter(), map(items => items.length));
      this.filtererString = getFiltererString(filterer);
    }
  }

  edit() {
    combineLatest(this.activeStore.config, this.activeStore.data)
      .pipe(take(1))
      .subscribe(results => {
        this.recommendationDialog.edit(
          this.recommendation, results[0], results[1], this.dataResourcesMap);
      });
  }

  duplicate() {
    const newRecommendation = {...this.recommendation};
    delete newRecommendation.id;
    this.activeStore.activeConfig.recommendations.add(newRecommendation);
  }

  remove() {
    this.recommendationDialog.remove(this.recommendation, this.activeStore.activeConfig);
  }

  open() {
    this.router.navigate([`../../../${this.activeStore.activeName}/query/new`], {
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
