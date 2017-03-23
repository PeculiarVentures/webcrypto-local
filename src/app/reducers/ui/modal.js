import { ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const modal = state.find('modal');
  const { type, value } = payload;
  switch (type) {

    case ACTIONS_CONST.MODAL_OPEN: {
      modal.set(value);
      break;
    }

    case ACTIONS_CONST.MODAL_CLOSE: {
      modal.set('');
      break;
    }

    default:
      return state;
  }

  return state;
}
