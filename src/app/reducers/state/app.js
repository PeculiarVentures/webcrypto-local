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

    case ACTIONS_CONST.APP_DATA_LOADED: {
      state.merge({ dataLoaded: payload.state });
      break;
    }

    case ACTIONS_CONST.APP_ONLINE: {
      state.merge({ serverIsOnline: payload.state });
      break;
    }

    default:
      return state;
  }

  return state;
}
