import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {createSelector} from '@ngrx/store';
import {Label} from '../../../github/app-types/label';
import {getRepoState} from '../repo-state.selector';
import {LabelAction, LabelActionTypes} from './label.action';
import {LabelState} from './label.state';

export const entityAdapter: EntityAdapter<Label> =
  createEntityAdapter<Label>();

const initialState: LabelState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
};

export function labelActionReducer(state: LabelState = initialState, action: LabelAction): LabelState {
  switch (action.type) {

    case LabelActionTypes.UPDATE_FROM_GITHUB:
      return entityAdapter.upsertMany(action.payload.labels, state);

    case LabelActionTypes.LOAD_COMPLETE:
      return entityAdapter.addAll(action.payload.labels, state);

    case LabelActionTypes.REMOVE_ALL:
      return entityAdapter.removeAll(state);

    default:
      return state;
  }
}

const {
  selectIds,
  selectAll,
  selectTotal
} = entityAdapter.getSelectors();

const selectLabelState = createSelector(getRepoState, repoState => repoState.labels);

export const selectLabelIds = createSelector(selectLabelState, selectIds);
export const selectLabels = createSelector(selectLabelState, selectAll);
export const selectLabelTotal = createSelector(selectLabelState, selectTotal);
