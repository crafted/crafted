import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest, interval, of} from 'rxjs';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {Item} from '../../../github/app-types/item';
import {Github} from '../../../service/github';
import {RepositoryDatabase} from '../../../service/repository-database';
import {selectIsAuthenticated} from '../../../store/auth/auth.reducer';
import {Updater} from '../../services/updater';
import {AppState} from '../index';
import {selectRepositoryName} from '../name/name.reducer';
import {
  ItemActionTypes,
  ItemAddAssigneeAction,
  ItemAddAssigneeFailedAction,
  ItemAddLabelAction,
  ItemAddLabelFailedAction,
  ItemRemoveLabelAction,
  ItemRemoveLabelFailedAction, ItemUpdateTitleAction, ItemUpdateTitleFailedAction,
  LoadItems,
  LoadItemsComplete,
  RemoveAllItems,
  UpdateItemsFromGithub
} from './item.action';
import {selectItemEntities, selectItems} from './item.reducer';

@Injectable()
export class ItemEffects {
  @Effect()
  load = this.actions.pipe(ofType<LoadItems>(ItemActionTypes.LOAD), switchMap(action => {
                             return this.repositoryDatabase.getValues(action.payload.repository)
                                 .items.pipe(take(1), map(items => new LoadItemsComplete({items})));
                           }));

  /**
   * After the items are loaded from the local database, request updates from GitHub periodically
   * if the user is authenticated.
   */
  @Effect({dispatch: false})
  periodicallyUpdate = this.actions.pipe(
      ofType(ItemActionTypes.LOAD_COMPLETE),
      switchMap(() => interval(10 * 1000 * 60).pipe(startWith(null))),
      switchMap(() => this.store.select(selectIsAuthenticated).pipe(take(1))),
      filter(isAuthenticated => isAuthenticated), tap(isAuthenticated => {
        if (isAuthenticated) {
          this.updater.update('items');
        }
      }));

  /**
   * Periodically update the pull request statuses
   */
  @Effect({dispatch: false})
  periodicallyUpdatePullRequests = this.actions.pipe(
      ofType(ItemActionTypes.LOAD_COMPLETE),
      switchMap(() => interval(10 * 1000 * 60).pipe(startWith(null))),
      switchMap(
          () =>
              combineLatest(this.store.select(selectRepositoryName), this.store.select(selectItems))
                  .pipe(take(1))),
      switchMap(([repo, items]) => {
        const openPullRequests = items.filter(i => !!i.pr && i.state === 'open').map(i => i.id);
        return this.github.getPullRequestStatuses(repo, openPullRequests)
            .pipe(filter(result => result.total === result.completed));
      }),
      withLatestFrom(this.store.select(selectItemEntities)), tap(([statusResult, items]) => {
        const pullRequests: Item[] = [];
        statusResult.accumulated.forEach(result => {
          pullRequests.push({...items[result.number], statuses: result.statuses});
        });
        this.store.dispatch(new UpdateItemsFromGithub({items: pullRequests}));
      }));

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

  @Effect({dispatch: false})
  persistAddLabel = this.actions.pipe(
      ofType<ItemAddLabelAction>(ItemActionTypes.ADD_LABEL),
      withLatestFrom(combineLatest(
          this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
      map(([action, [items, repository]]) => {
        this.repositoryDatabase.update(repository, 'items', [items[action.payload.itemId]]);
        this.github.addLabel(repository, action.payload.itemId, action.payload.labelName)
            .pipe(
                catchError(error => {
                  console.log('Error from Github: ', error);
                  this.store.dispatch(new ItemAddLabelFailedAction(action.payload));
                  return of();
                }),
                take(1))
            .subscribe();
      }));

  @Effect({dispatch: false})
  persistRemoveLabel = this.actions.pipe(
      ofType<ItemRemoveLabelAction>(ItemActionTypes.REMOVE_LABEL),
      withLatestFrom(combineLatest(
          this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
      map(([action, [items, repository]]) => {
        this.repositoryDatabase.update(repository, 'items', [items[action.payload.itemId]]);
        this.github.removeLabel(repository, action.payload.itemId, action.payload.labelName)
            .pipe(
                catchError(error => {
                  console.log('Error from Github: ', error);
                  this.store.dispatch(new ItemRemoveLabelFailedAction(action.payload));
                  return of();
                }),
                take(1))
            .subscribe();
      }));

  @Effect({dispatch: false})
  persistAddAssignee = this.actions.pipe(
      ofType<ItemAddAssigneeAction>(ItemActionTypes.ADD_ASSIGNEE),
      withLatestFrom(combineLatest(
          this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
      map(([action, [items, repository]]) => {
        this.repositoryDatabase.update(repository, 'items', [items[action.payload.itemId]]);
        this.github.addAssignee(repository, action.payload.itemId, action.payload.assignee)
            .pipe(
                catchError(error => {
                  console.log('Error from Github: ', error);
                  this.store.dispatch(new ItemAddAssigneeFailedAction(action.payload));
                  return of();
                }),
                take(1))
            .subscribe();
      }));

  @Effect({dispatch: false})
  persistUpdateTitle = this.actions.pipe(
    ofType<ItemUpdateTitleAction>(ItemActionTypes.UPDATE_TITLE),
    withLatestFrom(combineLatest(
      this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
    map(([action, [items, repository]]) => {
      this.repositoryDatabase.update(repository, 'items', [items[action.payload.itemId]]);
      this.github.updateTitle(repository, action.payload.itemId, action.payload.newTitle)
        .pipe(
          catchError(error => {
            console.log('Error from Github: ', error);
            this.store.dispatch(new ItemUpdateTitleFailedAction(action.payload));
            return of();
          }),
          take(1))
        .subscribe();
    }));


  @Effect({dispatch: false})
  persistUpdateTitleFailed = this.actions.pipe(
    ofType<ItemUpdateTitleFailedAction>(ItemActionTypes.UPDATE_TITLE_FAILED),
    withLatestFrom(combineLatest(
      this.store.select(selectItemEntities), this.store.select(selectRepositoryName))),
    map(([action, [items, repository]]) => {
      this.repositoryDatabase.update(repository, 'items', [items[action.payload.itemId]]);
    }));

  constructor(
      private actions: Actions, private store: Store<AppState>, private github: Github,
      private updater: Updater, private repositoryDatabase: RepositoryDatabase) {}
}
