import {AuthAction, AuthActionTypes} from './auth.action';
import {AuthState} from './auth.state';

const initialState: AuthState = {
  name: '',
};

export function authActionReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {

    case AuthActionTypes.LOAD:
      return {...state, name: action.payload.name};

    default:
      return state;
  }
}
