import UUID from 'uuid';
import { ItemActions, ProviderActions } from '../actions/state';
// import { DialogActions } from '../actions/ui';
import { ACTIONS_CONST } from '../constants';
// import { RoutingController } from '../controllers';

export default store => next => (payload) => {
  const state = store.getState();
  const { type, result, path, id, index } = payload;
  switch (type) {

    // case ACTIONS_CONST.CERTIFICATE_SELECT: {
      // if (payload.id) {
      //   RoutingController.push(`certificate/${id}`);
      // }

    //   next(CertificateActions.select(id));
    //   break;
    // }

    case ACTIONS_CONST.ITEM_ADD: {
      const itemId = result.id || UUID();
      const data = Object.assign({}, result, {
        id: itemId,
        selected: false,
      });
      const itemIndex = index || state.find('providers').where({ selected: true }).get().index;

      next(ItemActions.add(data, itemIndex));
      break;
    }

    case ACTIONS_CONST.PROVIDER_SELECT: {
      const providers = state.find('providers');
      const provider = providers.where({ id });
      let _id = id;

      if (!provider) {
        _id = providers.get()[0].id;
      }

      next(ProviderActions.select(_id));
      break;
    }

    case ACTIONS_CONST.ITEM_SELECT: {
      const providers = state.find('providers');
      const provider = providers.where({ selected: true });
      const items = provider.find('items');
      const item = items.where({ id });
      let _id = id;

      if (!item) {
        _id = items.get()[0].id;
      }

      next(ItemActions.select(_id));
      break;
    }

    // case ACTIONS_CONST.CERTIFICATE_REMOVE: {
    //   next(DialogActions.close());
    //   next(CertificateActions.remove(id));
    //   break;
    // }
    //
    // case ACTIONS_CONST.ROUTING_PUSH: {
    //   RoutingController.push(path);
    //   break;
    // }
    //
    // case ACTIONS_CONST.ROUTING_BACK: {
    //   RoutingController.goBack();
    //   break;
    // }

    default:
      next(payload);
  }
};
