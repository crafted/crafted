import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {StoreId} from '../../repository/utility/app-indexed-db';
import {GitHubAddAssignee, GitHubAddLabel, GitHubRemoveLabel} from '../github/github.actions';
import {AppState} from '../index';
import {UpdateLocalDbEntities} from '../local-db/local-db.actions';
import {
  ItemActionTypes,
  ItemAddAssigneeAction,
  ItemAddLabelAction,
  ItemRemoveLabelAction,
  UpdateItemsFromGithub
} from './item.action';

@Injectable()
export class ItemEffects {
  @Effect()
  persistGithubUpdatesToLocalDb =
    this.actions.pipe(ofType<UpdateItemsFromGithub>(ItemActionTypes.UPDATE_ITEMS_FROM_GITHUB), map(action => {
      const updatePayload = {
        entities: action.payload.items,
        type: 'items' as StoreId
      };
      return new UpdateLocalDbEntities(updatePayload);
    }));

  @Effect()
  persistAddLabel =
    this.actions.pipe(ofType<ItemAddLabelAction>(ItemActionTypes.ADD_LABEL),
      withLatestFrom(this.store.select(state => state.items)),
      switchMap(([action, items]) => {
        // Update in local database
        const updatePayload = {
          entities: [items.entities[action.payload.id]],
          type: 'items' as StoreId
        };
        const updateLocalDbEntitiesAction = new UpdateLocalDbEntities(updatePayload);

        // Update in github
        const githubAddLabelPayload = {
          id: action.payload.id,
          label: action.payload.label,
        };
        const githubAddLabelAction = new GitHubAddLabel(githubAddLabelPayload);

        return [updateLocalDbEntitiesAction, githubAddLabelAction];
      }));


  @Effect()
  persistRemoveLabel =
    this.actions.pipe(ofType<ItemRemoveLabelAction>(ItemActionTypes.REMOVE_LABEL),
      withLatestFrom(this.store.select(state => state.items)),
      switchMap(([action, items]) => {
        // Update in local database
        const updatePayload = {
          entities: [items.entities[action.payload.id]],
          type: 'items' as StoreId
        };
        const updateLocalDbEntitiesAction = new UpdateLocalDbEntities(updatePayload);

        // Update in github
        const githubRemoveLabelPayload = {
          id: action.payload.id,
          label: action.payload.label,
        };
        const githubRemoveLabelAction = new GitHubRemoveLabel(githubRemoveLabelPayload);

        return [updateLocalDbEntitiesAction, githubRemoveLabelAction];
      }));

  @Effect()
  persistAddAssignee =
    this.actions.pipe(ofType<ItemAddAssigneeAction>(ItemActionTypes.ADD_ASSIGNEE),
      withLatestFrom(this.store.select(state => state.items)),
      switchMap(([action, items]) => {
        // Update in local database
        const updatePayload = {
          entities: [items.entities[action.payload.id]],
          type: 'item' as StoreId
        };
        const updateLocalDbEntitiesAction = new UpdateLocalDbEntities(updatePayload);

        // Update in github
        const githubAddAssigneePayload = {
          id: action.payload.id,
          assignee: action.payload.assignee,
        };
        const githubAddAssigneeAction = new GitHubAddAssignee(githubAddAssigneePayload);

        return [updateLocalDbEntitiesAction, githubAddAssigneeAction];
      }));

  constructor(private actions: Actions, private store: Store<AppState>) {}
}
