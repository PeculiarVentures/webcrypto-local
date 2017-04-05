import { ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const { type, result, id } = payload;
  const providers = state.find('providers');
  switch (type) {

    case ACTIONS_CONST.PROVIDER_ADD: {
      providers.add(result);
      return state;
    }

    case ACTIONS_CONST.PROVIDERS_UPDATE: {
      state.merge({ providers: result });
      return state;
    }

    case ACTIONS_CONST.PROVIDER_SELECT: {
      providers.select(id);
      return state;
    }

    default:
      return state;
  }
}
