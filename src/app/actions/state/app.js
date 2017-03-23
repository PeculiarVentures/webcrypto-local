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
