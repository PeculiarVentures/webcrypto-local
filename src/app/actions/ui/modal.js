import { ACTIONS_CONST } from '../../constants';

export const open = value => ({
  type: ACTIONS_CONST.MODAL_OPEN,
  value,
});

export const close = () => ({
  type: ACTIONS_CONST.MODAL_CLOSE,
});
