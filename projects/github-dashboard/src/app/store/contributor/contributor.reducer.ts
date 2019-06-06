import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Contributor} from '../../github/app-types/contributor';
import {ContributorAction, ContributorActionTypes} from './contributor.action';
import {ContributorState} from './contributor.state';

export const entityAdapter: EntityAdapter<Contributor> =
  createEntityAdapter<Contributor>();

const initialState: ContributorState = {
  ids: entityAdapter.getInitialState().ids as string[],
  entities: entityAdapter.getInitialState().entities,
};

export function contributorActionReducer(state: ContributorState = initialState, action: ContributorAction): ContributorState {
  switch (action.type) {

    case ContributorActionTypes.UPDATE_FROM_GITHUB:
      return entityAdapter.upsertMany(action.payload.contributors, state);

    case ContributorActionTypes.LOAD_FROM_LOCAL_DB:
      return entityAdapter.addAll(action.payload.contributors, state);

    case ContributorActionTypes.REMOVE_ALL:
      return entityAdapter.removeAll(state);

    default:
      return state;
  }
}
