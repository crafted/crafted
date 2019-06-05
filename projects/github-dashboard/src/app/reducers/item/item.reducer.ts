import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Item} from '../../github/app-types/item';
import {ItemAction, ItemActionTypes} from './item.action';
import {ItemState} from './item.state';

export const itemAdapter : EntityAdapter<Item> =
  createEntityAdapter<Item>();

const initialState: ItemState = itemAdapter.getInitialState();

export function itemActionReducer(state: ItemState = initialState, action: ItemAction): ItemState {
  switch (action.type) {

    case ItemActionTypes.ADD_ONE_ITEM:
      return itemAdapter.addOne(action.payload.item, state);

    case ItemActionTypes.ADD_MANY_ITEMS:
      return itemAdapter.addMany(action.payload.items, state);

    case ItemActionTypes.ADD_ALL_ITEMS:
      return itemAdapter.addAll(action.payload.items, state);

    case ItemActionTypes.ADD_LABEL: {
      const item = state.entities[action.payload.id];
      item.labels.push(action.payload.label);
      return {ids: state.ids, entities: state.entities};
    }

    case ItemActionTypes.REMOVE_LABEL: {
      const item = state.entities[action.payload.id];
      const labels = item.labels;
      const index = labels.indexOf(action.payload.label);
      labels.splice(index, 1);
      item.labels = labels;
      return {ids: state.ids, entities: state.entities};
    }
    default:
      return state;
  }
}
