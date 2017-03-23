import { INITIAL_STATE, ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const { type } = payload;
  switch (type) {

    case ACTIONS_CONST.APP_RESET_STATE: {
      state.merge(INITIAL_STATE);
      break;
    }

    case ACTIONS_CONST.APP_SET_STATE: {
      state.setState(payload.state, payload.from);
      break;
    }

    default:
      return state;
  }

  return state;
}
