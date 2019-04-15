import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DataSource, Filterer, FiltererState} from '@crafted/data';
import {take} from 'rxjs/operators';
import {ConfigStore} from '../../../services/dao/config/config-dao';
import {Recommendation} from '../../../services/dao/config/recommendation';
import {DataStore} from '../../../services/dao/data-dao';
import {RecommendationEdit} from './recommendation-edit/recommendation-edit';

export type RecommendationsDataResourcesMap = Map<string, {
  id: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  dataSource: () => DataSource,
}>;

@Injectable()
export class RecommendationDialog {
  constructor(private dialog: MatDialog) {}

  /** Opens a dialog for the user to create a new recommendation. */
  createRecommendation(
      configStore: ConfigStore, dataStore: DataStore,
      dataResourcesMap: RecommendationsDataResourcesMap) {
    const data = {recommendation: {}, dataResourcesMap, dataStore};
    this.dialog.open(RecommendationEdit, {data, width: '600px'})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            configStore.recommendations.add(result);
          }
        });
  }

  /** Opens a dialog for the user to edit an existing recommendation. */
  editRecommendation(
      recommendation: Recommendation, configStore: ConfigStore, dataStore: DataStore,
      dataResourcesMap: RecommendationsDataResourcesMap) {
    const data = {recommendation, dataResourcesMap, dataStore};
    this.dialog.open(RecommendationEdit, {data, width: '600px'})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            configStore.recommendations.update(result);
          }
        });
  }
}
