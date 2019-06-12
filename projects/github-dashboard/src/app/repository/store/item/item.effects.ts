import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {RepositoryDatabase} from '../../../service/repository-database';
import {GitHubAddAssignee, GitHubAddLabel, GitHubRemoveLabel} from '../github/github.actions';
import {AppState} from '../index';
import {selectRepositoryName} from '../repository/repository.reducer';
import {
  ItemActionTypes,
  ItemAddAssigneeAction,
  ItemAddLabelAction,
  ItemRemoveLabelAction,
  RemoveAllItems,
  UpdateItemsFromGithub
} from './item.action';
import {selectItemEntities} from './item.reducer';

@Injectable()
export class ItemEffects {
  @Effect({dispatch: false})
  persistGithubUpdatesToLocalDb = this.actions.pipe(
      ofType<UpdateItemsFromGithub>(ItemActionTypes.UPDATE_ITEMS_FROM_GITHUB),
      withLatestFrom(this.store.select(selectRepositoryName)), tap(([action, repository]) => {
        this.repositoryDatabase.update(repository, 'items', action.payload.items);
      }));

  @Effect({dispatch: false})
  persistRemoveAllToLocalDb = this.actions.pipe(
      ofType<RemoveAllItems>(ItemActionTypes.REMOVE_ALL),
      switchMap(() => this.store.select(selectRepositoryName).pipe(take(1))),
      tap(repository => this.repositoryDatabase.removeAll(repository, 'items')));

  @Effect()
  persistAddLabel = this.actions.pipe(
      ofType<ItemAddLabelAction>(ItemActionTypes.ADD_LABEL),
      withLatestFrom(combineLatest(
          this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
      map(([action, [items, repository]]) => {
        this.repositoryDatabase.update(repository, 'items', [items[action.payload.id]]);
        return new GitHubAddLabel({
          id: action.payload.id,
          label: action.payload.label,
        });
      }));


  @Effect()
  persistRemoveLabel = this.actions.pipe(
      ofType<ItemRemoveLabelAction>(ItemActionTypes.REMOVE_LABEL),
      withLatestFrom(combineLatest(
          this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
      map(([action, [items, repository]]) => {
        this.repositoryDatabase.update(repository, 'items', [items[action.payload.id]]);

        return new GitHubRemoveLabel({
          id: action.payload.id,
          label: action.payload.label,
        });
      }));

  @Effect()
  persistAddAssignee = this.actions.pipe(
      ofType<ItemAddAssigneeAction>(ItemActionTypes.ADD_ASSIGNEE),
      withLatestFrom(combineLatest(
          this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
      map(([action, [items, repository]]) => {
        this.repositoryDatabase.update(repository, 'items', [items[action.payload.id]]);
        return new GitHubAddAssignee({
          id: action.payload.id,
          assignee: action.payload.assignee,
        });
      }));

  constructor(private actions: Actions, private store: Store<AppState>, private repositoryDatabase: RepositoryDatabase) {}
}
