import { ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const { type, result, id } = payload;
  const certificates = state.find('certificates');
  switch (type) {

    case ACTIONS_CONST.CERTIFICATE_ADD: {
      certificates.add(result);
      return state;
    }

    case ACTIONS_CONST.CERTIFICATE_SELECT: {
      certificates.select(id);
      return state;
    }

    case ACTIONS_CONST.CERTIFICATE_REMOVE: {
      certificates.selectNextOrPrev(id);
      certificates.remove(id);
      return state;
    }

    default:
      return state;
  }
}
