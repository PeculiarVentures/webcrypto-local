import { ACTIONS_CONST } from '../../constants';

export const openModal = value => ({
  type: ACTIONS_CONST.MODAL_OPEN,
  value,
});

export const closeModal = () => ({
  type: ACTIONS_CONST.MODAL_CLOSE,
});
