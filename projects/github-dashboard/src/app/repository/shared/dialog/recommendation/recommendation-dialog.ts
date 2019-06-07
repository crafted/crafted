import {Injectable} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DataSource, Filterer, FiltererState} from '@crafted/data';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../../../store';
import {
  CreateRecommendation,
  RemoveRecommendation,
  SyncRecommendations,
  UpdateRecommendation
} from '../../../../store/recommendation/recommendation.action';
import {Recommendation} from '../../../model/recommendation';
import {compareLocalToRemote} from '../../../utility/list-dao';
import {DeleteConfirmation} from '../delete-confirmation/delete-confirmation';
import {
  RecommendationEdit,
  RecommendationEditData
} from './recommendation-edit/recommendation-edit';
import {RecommendationsEditJson} from './recommendations-edit-json/recommendations-edit-json';

export type RecommendationsDataResourcesMap = Map<string, {
  type: string,
  label: string,
  filterer: (initialValue?: FiltererState) => Filterer,
  dataSource: () => DataSource,
}>;

@Injectable()
export class RecommendationDialog {
  constructor(
      private dialog: MatDialog, private snackbar: MatSnackBar, private store: Store<AppState>) {}

  /** Opens a dialog for the user to create a new recommendation. */
  create(dataResourcesMap: RecommendationsDataResourcesMap) {
    const data = {recommendation: {}, dataResourcesMap};
    this.dialog.open(RecommendationEdit, {data, width: '600px', disableClose: true})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            this.store.dispatch(new CreateRecommendation({recommendation: result}));
          }
        });
  }

  /** Opens a dialog for the user to edit an existing recommendation. */
  edit(recommendation: Recommendation, dataResourcesMap: RecommendationsDataResourcesMap) {
    const data = {recommendation, dataResourcesMap};
    this.dialog
        .open<RecommendationEdit, RecommendationEditData, Recommendation>(
            RecommendationEdit, {data, width: '600px'})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            this.store.dispatch(
                new UpdateRecommendation({update: {id: result.id, changes: result}}));
          }
        });
  }

  jsonEditor(recommendations: Recommendation[]) {
    this.dialog.open(RecommendationsEditJson, {data: {recommendations}, width: '600px'})
        .afterClosed()
        .pipe(take(1))
        .subscribe(result => {
          if (result) {
            // TODO: Sync with what is done in repo-gist
            const changes = compareLocalToRemote(recommendations, result);
            const addRecommendations = changes.toAdd.map(r => ({id: r.id, changes: {...r}}));
            const updateRecommendations = changes.toUpdate.map(r => ({id: r.id, changes: {...r}}));
            this.store.dispatch(new SyncRecommendations({
              update: updateRecommendations.concat(addRecommendations),
              remove: changes.toRemove.map(r => r.id),
            }));
          }
        });
  }

  remove(recommendation: Recommendation) {
    const data = {name: of('this recommendation')};

    this.dialog.open(DeleteConfirmation, {data})
        .afterClosed()
        .pipe(take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            this.store.dispatch(new RemoveRecommendation({id: recommendation.id}));
            this.snackbar.open(`Recommendation deleted`, '', {duration: 2000});
          }
        });
  }
}
