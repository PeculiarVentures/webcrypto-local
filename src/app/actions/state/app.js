import { ACTIONS_CONST } from '../../constants';

export const resetState = () => ({
  type: ACTIONS_CONST.APP_RESET_STATE,
});

export const loadState = state => ({
  type: ACTIONS_CONST.APP_LOAD_STATE,
  state,
});

export const setState = (state, from) => ({
  type: ACTIONS_CONST.APP_SET_STATE,
  state,
  from,
});

export const loaded = state => ({
  type: ACTIONS_CONST.APP_DATA_LOADED,
  state,
});

export const create = state => ({
  type: ACTIONS_CONST.APP_CREATE,
  state,
});

export const readState = state => ({
  type: ACTIONS_CONST.APP_READ_STATE,
  state,
});
