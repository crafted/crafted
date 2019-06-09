import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {Github} from '../../../service/github';
import {AppState} from '../index';
import {UpdateItemsFromGithub} from '../item/item.action';
import {getRepoState} from '../repo-state.selector';
import {selectRepositoryName} from '../repository/repository.reducer';
import {
  GitHubActionTypes,
  GitHubAddAssignee,
  GitHubAddLabel,
  GitHubRemoveLabel,
  GitHubUpdateItem
} from './github.actions';

@Injectable()
export class GithubEffects {
  @Effect({dispatch: false})
  addLabel = this.actions.pipe(
      ofType<GitHubAddLabel>(GitHubActionTypes.ADD_LABEL),
      withLatestFrom(this.store.select(getRepoState)),
      switchMap(
          ([action, state]) =>
              this.github.addLabel(state.repository.name, action.payload.id, state.labels.entities[action.payload.label].name)));

  @Effect({dispatch: false})
  removeLabel = this.actions.pipe(
      ofType<GitHubRemoveLabel>(GitHubActionTypes.REMOVE_LABEL),
      withLatestFrom(this.store.select(getRepoState)),
      switchMap(
          ([action, state]) =>
              this.github.removeLabel(state.repository.name, action.payload.id, state.labels.entities[action.payload.label].name)));

  @Effect({dispatch: false})
  addAssignee = this.actions.pipe(
      ofType<GitHubAddAssignee>(GitHubActionTypes.ADD_ASSIGNEE),
      withLatestFrom(this.store.select(selectRepositoryName)),
      switchMap(
          ([action, repository]) =>
              this.github.addAssignee(repository, action.payload.id, action.payload.assignee)));

  @Effect()
  updateItem = this.actions.pipe(
      ofType<GitHubUpdateItem>(GitHubActionTypes.UPDATE_ITEM),
      withLatestFrom(this.store.select(selectRepositoryName)),
      mergeMap(([action, repository]) => this.github.getItem(repository, action.payload.id)),
      map(item => new UpdateItemsFromGithub({items: [item]})));

  constructor(private actions: Actions, private github: Github, private store: Store<AppState>) {}
}
