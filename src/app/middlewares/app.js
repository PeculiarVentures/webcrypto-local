import uuid from 'uuid';
import { CertificateActions } from '../actions/state';
import { DialogActions } from '../actions/ui';
import { ACTIONS_CONST } from '../constants';
import { RoutingController } from '../controllers';

export default () => next => (payload) => {
  const { type, result, path, id } = payload;
  switch (type) {

    case ACTIONS_CONST.CERTIFICATE_SELECT: {
      // if (payload.id) {
      //   RoutingController.push(`certificate/${id}`);
      // }

      next(CertificateActions.select(id));
      break;
    }

    case ACTIONS_CONST.CERTIFICATE_ADD: {
      const certificateId = result.id || uuid();
      const certificateData = Object.assign({}, result, {
        id: certificateId,
        selected: false,
      });

      next(CertificateActions.add(certificateData));
      // RoutingController.push(`certificate/${certificateId}`);
      break;
    }

    case ACTIONS_CONST.CERTIFICATE_REMOVE: {
      next(DialogActions.close());
      next(CertificateActions.remove(id));
      break;
    }

    case ACTIONS_CONST.ROUTING_PUSH: {
      RoutingController.push(path);
      break;
    }

    case ACTIONS_CONST.ROUTING_BACK: {
      RoutingController.goBack();
      break;
    }

    default:
      next(payload);
  }
};
