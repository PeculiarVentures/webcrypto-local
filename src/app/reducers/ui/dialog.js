import { ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const dialog = state.find('dialog');
  const { type, value } = payload;

  switch (type) {

    case ACTIONS_CONST.DIALOG_OPEN: {
      dialog.set(value);
      break;
    }

    case ACTIONS_CONST.DIALOG_CLOSE: {
      dialog.set('');
      break;
    }

    default:
      return state;
  }

  return state;
}
