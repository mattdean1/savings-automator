import {handleActions, createAction} from "redux-actions";
import {sourceUrlEncode} from '../../../commons/utils'

// ------------------------------------
// Constants
// ------------------------------------
const LOADING = 'LOADING';

const loaderDelay = 100;
// ------------------------------------
// Actions
// ------------------------------------
const loadingAction = createAction(LOADING);

export const setLoading = (isLoading) => {
  return dispatch => {
    dispatch(loadingAction(isLoading))
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------

const initialState = {
  loading: false,
};

export default handleActions({
  [LOADING]: (state, action) => {
    return Object.assign({}, state, {loading: action.payload});
  }
}, initialState);
