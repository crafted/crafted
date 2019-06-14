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
  loading: false,
};

export function labelActionReducer(state: LabelState = initialState, action: LabelAction): LabelState {
  switch (action.type) {

    case LabelActionTypes.UPDATE_FROM_GITHUB:
      return entityAdapter.upsertMany(action.payload.labels, state);

    case LabelActionTypes.LOAD:
      return {...state, loading: true};

    case LabelActionTypes.LOAD_COMPLETE:
      state = {...state, loading: false};
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
export const selectLabelsLoading =
  createSelector(selectLabelState, state => state.loading);
