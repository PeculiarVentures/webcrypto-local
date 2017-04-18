import { ACTIONS_CONST } from '../../constants';

export const select = id => ({
  type: ACTIONS_CONST.ITEM_SELECT,
  id,
});

export const update = (id, result) => ({
  type: ACTIONS_CONST.ITEM_UPDATE,
  id,
  result,
});

export const add = (result, id) => ({
  type: ACTIONS_CONST.ITEM_ADD,
  result,
  id,
});

export const remove = id => ({
  type: ACTIONS_CONST.ITEM_REMOVE,
  id,
});

export const download = id => ({
  type: ACTIONS_CONST.ITEM_DOWNLOAD,
  id,
});

export const copy = id => ({
  type: ACTIONS_CONST.ITEM_COPY,
  id,
});
