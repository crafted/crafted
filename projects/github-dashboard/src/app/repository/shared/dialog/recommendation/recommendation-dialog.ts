import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DataSource, Filterer, FiltererState} from '@crafted/data';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {ConfigStore} from '../../../services/dao/config/config-dao';
import {Recommendation} from '../../../services/dao/config/recommendation';
import {DataStore} from '../../../services/dao/data-dao';
import {compareLocalToRemote} from '../../../services/dao/list-dao';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation';
import {RecommendationEdit} from './recommendation-edit/recommendation-edit';
import {RecommendationsEditJson} from './recommendations-edit-json/recommendations-edit-json';

export type RecommendationsDataResourcesMap = Map<string, {
  id: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  dataSource: () => DataSource,
}>;

@Injectable()
export class RecommendationDialog {
  constructor(private dialog: MatDialog, private snackbar: MatSnackBar) {}

  /** Opens a dialog for the user to create a new recommendation. */
  create(
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
  edit(
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

  jsonEditor(recommendations: Recommendation[], configStore: ConfigStore) {
    this.dialog.open(RecommendationsEditJson, {data: {recommendations}, width: '600px'})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            const changes = compareLocalToRemote(recommendations, result);
            changes.toAdd.forEach(r => configStore.recommendations.add(r));
            changes.toUpdate.forEach(r => configStore.recommendations.update(r));
            changes.toRemove.forEach(r => configStore.recommendations.remove(r.id));
          }
        });
  }

  remove(recommendation: Recommendation, store: ConfigStore) {
    const data = {name: of('this recommendation')};

    this.dialog.open(DeleteConfirmation, {data})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            store.recommendations.remove(recommendation.id!);
            this.snackbar.open(`Recommendation deleted`, '', {duration: 2000});
          }
        });
  }
}
