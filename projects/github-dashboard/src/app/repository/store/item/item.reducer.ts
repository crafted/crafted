import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {Item} from '../../../github/app-types/item';
import {getRepoState} from '../repo-state.selector';
import {ItemAction, ItemActionTypes} from './item.action';
import {ItemState} from './item.state';

export const entityAdapter: EntityAdapter<Item> =
  createEntityAdapter<Item>();

const initialState: ItemState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
  loading: false,
};

export function itemActionReducer(state: ItemState = initialState, action: ItemAction): ItemState {
  switch (action.type) {

    case ItemActionTypes.UPDATE_ITEMS_FROM_GITHUB:
      return entityAdapter.upsertMany(action.payload.items, state);

    case ItemActionTypes.LOAD:
      return {...state, loading: true};

    case ItemActionTypes.LOAD_COMPLETE:
      state = {...state, loading: false};
      return entityAdapter.addAll(action.payload.items, state);

    case ItemActionTypes.REMOVE_ALL:
      return entityAdapter.removeAll(state);

    case ItemActionTypes.ADD_LABEL: {
      const item = state.entities[action.payload.itemId];
      const labels = [...item.labels];
      if (labels.indexOf(action.payload.labelId) === -1) {
        labels.push(action.payload.labelId);
      }
      item.labels = labels;

      return {...state};
    }

    case ItemActionTypes.REMOVE_LABEL: {
      const item = state.entities[action.payload.itemId];
      const labels = [...item.labels];
      const index = labels.indexOf(action.payload.labelId);
      labels.splice(index, 1);
      item.labels = labels;
      return {...state};
    }

    case ItemActionTypes.ADD_ASSIGNEE: {
      const item = state.entities[action.payload.itemId];
      item.assignees.push(action.payload.assignee);
      return {...state};
    }

    case ItemActionTypes.REMOVE_ASSIGNEE: {
      const item = state.entities[action.payload.itemId];
      const assignees = item.assignees;
      const index = assignees.indexOf(action.payload.assignee);
      assignees.splice(index, 1);
      item.assignees = assignees;
      return {...state};
    }

    default:
      return state;
  }
}

const {
  selectEntities,
  selectIds,
  selectTotal,
  selectAll
} = entityAdapter.getSelectors();

const selectItemState = createSelector(getRepoState, repoState => repoState.items);

export const selectItemIds = createSelector(selectItemState, selectIds);
export const selectItemEntities = createSelector(selectItemState, selectEntities);
export const selectItemTotal = createSelector(selectItemState, selectTotal);
export const selectItems = createSelector(selectItemState, selectAll);
export const selectItemById = (id) => createSelector(selectItemEntities, items => items[id]);
export const selectItemsLoading =
  createSelector(selectItemState, state => state.loading);
