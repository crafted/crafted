import {RepositoryAction, RepositoryActionTypes} from './repository.action';
import {RepositoryState} from './repository.state';

const initialState: RepositoryState = {
  name: '',
};

export function repositoryActionReducer(state: RepositoryState = initialState, action: RepositoryAction): RepositoryState {
  switch (action.type) {

    case RepositoryActionTypes.LOAD_REPOSITORY:
      return {...state, name: action.payload.name};

    default:
      return state;
  }
}
