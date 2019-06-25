import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataSource, Filterer, Group, Grouper, Sorter} from '@crafted/data';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Recommendation} from '../../model/recommendation';
import {DATA_RESOURCES_MAP, DataResources} from '../../repository';
import {Header} from '../../services/header';
import {RecommendationDialog} from '../../shared/dialog/recommendation/recommendation-dialog';
import {HeaderContentAction} from '../../shared/header-content/header-content';
import {AppState} from '../../store';
import {selectRecommendations} from '../../store/recommendation/recommendation.reducer';
import {RECOMMENDATION_GROUPER_METADATA} from './metadata/grouper-metadata';
import {RECOMMENDATION_SORTER_METADATA} from './metadata/sorter-metadata';

type RecommendationAction = 'editJson'|'create';

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
      {data: this.store.select(selectRecommendations)});

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
      private header: Header, private recommendationDialog: RecommendationDialog,
      private store: Store<AppState>) {}

  create() {
    this.recommendationDialog.create(this.dataResourcesMap);
  }

  editJson() {
    this.store.select(selectRecommendations)
        .pipe(take(1))
        .subscribe(recommendations => {
          this.recommendationDialog.jsonEditor(recommendations);
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
