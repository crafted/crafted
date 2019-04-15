import {CdkPortal} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DataResources} from 'dist/data/public-api';
import {combineLatest, Subject} from 'rxjs';
import {map, mergeMap, startWith, takeUntil} from 'rxjs/operators';
import {DATA_RESOURCES_MAP} from '../repository';
import {ActiveStore} from '../services/active-store';
import {Recommendation} from '../services/dao/config/recommendation';
import {Header} from '../services/header';
import {RecommendationDialog} from '../shared/dialog/recommendation/recommendation-dialog';
import {EditableRecommendation} from './editable-recommendation/editable-recommendation';

@Component({
  selector: 'recommendations-page',
  styleUrls: ['recommendations-page.scss'],
  templateUrl: 'recommendations-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationsPage {
  filter = new FormControl('');

  @ViewChildren(EditableRecommendation) editableRecommendations: QueryList<EditableRecommendation>;

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
    this.recommendationDialog.createRecommendation(
        this.activeRepo.activeConfig, this.activeRepo.activeData, this.dataResourcesMap);
  }

  collapseAll() {
    this.editableRecommendations.forEach(v => v.collapse());
  }

  matchesFilter(recommendation: Recommendation) {
    const values: any[] = [];
    Object.keys(recommendation)
        .forEach(key => values.push(JSON.stringify((recommendation as any)[key] as any)));
    return values.join(';').toLowerCase().indexOf(this.filter.value.toLowerCase()) != -1;
  }
}
