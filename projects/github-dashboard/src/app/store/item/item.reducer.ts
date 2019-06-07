import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Item} from '../../github/app-types/item';
import {ItemAction, ItemActionTypes} from './item.action';
import {ItemState} from './item.state';

export const entityAdapter: EntityAdapter<Item> =
  createEntityAdapter<Item>();

const initialState: ItemState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
};

export function itemActionReducer(state: ItemState = initialState, action: ItemAction): ItemState {
  switch (action.type) {

    case ItemActionTypes.UPDATE_ITEMS_FROM_GITHUB:
      return entityAdapter.upsertMany(action.payload.items, state);

    case ItemActionTypes.LOAD_FROM_LOCAL_DB:
      return entityAdapter.addAll(action.payload.items, state);

    case ItemActionTypes.REMOVE_ALL:
      return entityAdapter.removeAll(state);

    case ItemActionTypes.ADD_LABEL: {
      const item = state.entities[action.payload.id];
      if (item.labels.indexOf(action.payload.label) === -1) {
        item.labels.push(action.payload.label);
      }

      return {...state};
    }

    case ItemActionTypes.REMOVE_LABEL: {
      const item = state.entities[action.payload.id];
      const labels = item.labels;
      const index = labels.indexOf(action.payload.label);
      labels.splice(index, 1);
      item.labels = labels;
      return {...state};
    }

    case ItemActionTypes.ADD_ASSIGNEE: {
      const item = state.entities[action.payload.id];
      item.assignees.push(action.payload.assignee);
      return {...state};
    }

    case ItemActionTypes.REMOVE_ASSIGNEE: {
      const item = state.entities[action.payload.id];
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

export const selectAllItems = entityAdapter.getSelectors().selectAll;
