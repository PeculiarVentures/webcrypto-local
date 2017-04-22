import { ACTIONS_CONST } from '../../constants';

export const add = result => ({
  type: ACTIONS_CONST.PROVIDER_ADD,
  result,
});

export const update = (result, id) => ({
  type: ACTIONS_CONST.PROVIDER_UPDATE,
  result,
  id,
});

export const select = id => ({
  type: ACTIONS_CONST.PROVIDER_SELECT,
  id,
});
