import { ACTIONS_CONST } from '../../constants';

export const select = id => ({
  type: ACTIONS_CONST.CERTIFICATE_SELECT,
  id,
});

export const update = (id, result) => ({
  type: ACTIONS_CONST.CERTIFICATE_UPDATE,
  id,
  result,
});

export const add = result => ({
  type: ACTIONS_CONST.CERTIFICATE_ADD,
  result,
});

export const remove = id => ({
  type: ACTIONS_CONST.CERTIFICATE_REMOVE,
  id,
});

export const download = id => ({
  type: ACTIONS_CONST.CERTIFICATE_DOWNLOAD,
  id,
});

export const copy = id => ({
  type: ACTIONS_CONST.CERTIFICATE_COPY,
  id,
});
