import {CdkPortal} from '@angular/cdk/portal';
import {ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataResources, DataSource, Filterer, Group, Grouper, Sorter} from '@crafted/data';
import {Subject} from 'rxjs';
import {mergeMap, take, takeUntil} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {Recommendation} from '../services/dao/config/recommendation';
import {Header} from '../services/header';
import {RecommendationDialog} from '../shared/dialog/recommendation/recommendation-dialog';
import {RecommendationGrouperMetadata} from './metadata/grouper-metadata';
import {RecommendationSorterMetadata} from './metadata/sorter-metadata';

@Component({
  selector: 'recommendations-page',
  styleUrls: ['recommendations-page.scss'],
  templateUrl: 'recommendations-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsPage {
  filter = new FormControl('');

  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  dataSource = new DataSource(
      {data: this.activeRepo.config.pipe(mergeMap(store => store.recommendations.list))});

  filterer = new Filterer({tokenizeItem: tokenizeRecommendation});

  grouper = new Grouper({metadata: RecommendationGrouperMetadata});

  sorter = new Sorter({metadata: RecommendationSorterMetadata});

  recommendationGroups =
      this.dataSource.data.pipe(this.filterer.filter(), this.sorter.sort(), this.grouper.group());

  trackById = (_i: number, r: Recommendation) => r.id;

  trackByGroupId = (_i: number, g: Group<Recommendation>) => g.id;

  constructor(
      @Inject(DATA_RESOURCES_MAP) private dataResourcesMap: Map<string, DataResources>,
      private header: Header, private activeRepo: ActiveStore,
      private recommendationDialog: RecommendationDialog) {}

  ngOnInit() {
    this.dataSource.data.pipe(takeUntil(this.destroyed)).subscribe(list => {
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

  editJson() {
    this.activeRepo.activeConfig.recommendations.list.pipe(take(1)).subscribe(list => {
      this.recommendationDialog.jsonEditor(list, this.activeRepo.activeConfig);
    });
  }
}

function tokenizeRecommendation(recommendation: Recommendation) {
  // TODO: Fill out more of the tokenization
  return recommendation.message;
}
