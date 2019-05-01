import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataResources, DataSource, Filterer, Group, Grouper, Sorter} from '@crafted/data';
import {combineLatest, Observable} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {Recommendation} from '../services/dao/config/recommendation';
import {Header} from '../services/header';
import {RecommendationDialog} from '../shared/dialog/recommendation/recommendation-dialog';
import {HeaderContentAction} from '../shared/header-content/header-content';
import {RECOMMENDATION_GROUPER_METADATA} from './metadata/grouper-metadata';
import {RECOMMENDATION_SORTER_METADATA} from './metadata/sorter-metadata';

type RecommendationAction = 'editJson' | 'create';

const HEADER_ACTIONS: HeaderContentAction<RecommendationAction>[] = [
  {
    id: 'editJson',
    icon: 'code',
    tooltip: 'Edit recommendations in JSON format',
  },
  {
    id: 'create',
    isPrimary: true,
    text: 'Create New Recommendation',
  },
];

@Component({
  selector: 'recommendations-page',
  styleUrls: ['recommendations-page.scss'],
  templateUrl: 'recommendations-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsPage {
  filter = new FormControl('');

  dataSource = new DataSource(
    {data: this.activeStore.config.pipe(mergeMap(store => store.recommendations.list))});

  headerActions: Observable<HeaderContentAction[]> = this.dataSource.data.pipe(
    map(recommendations => recommendations.length ? HEADER_ACTIONS : []));

  filterer = new Filterer({tokenizeItem: tokenizeRecommendation});

  grouper = new Grouper({metadata: RECOMMENDATION_GROUPER_METADATA});

  sorter = new Sorter({metadata: RECOMMENDATION_SORTER_METADATA});

  recommendationGroups =
      this.dataSource.data.pipe(this.filterer.filter(), this.sorter.sort(), this.grouper.group());

  trackByGroupId = (_i: number, g: Group<Recommendation>) => g.id;

  constructor(
    @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>,
    private header: Header, private activeStore: ActiveStore,
    private recommendationDialog: RecommendationDialog) {
  }

  create() {
    combineLatest(this.activeStore.config, this.activeStore.data)
      .pipe(take(1))
      .subscribe(results => {
        this.recommendationDialog.create(results[0], results[1], this.dataResourcesMap);
      });
  }

  editJson() {
    const recommendationsList =
      this.activeStore.config.pipe(mergeMap(configStore => configStore.recommendations.list));

    combineLatest(recommendationsList, this.activeStore.config).pipe(take(1)).subscribe(results => {
      this.recommendationDialog.jsonEditor(results[0], results[1]);
    });
  }

  handleHeaderAction(action: RecommendationAction) {
    switch (action) {
      case 'editJson':
        this.editJson();
        break;
      case 'create':
        this.create();
        break;
    }
  }
}

function tokenizeRecommendation(recommendation: Recommendation) {
  // TODO: Fill out more of the tokenization
  return recommendation.message;
}
