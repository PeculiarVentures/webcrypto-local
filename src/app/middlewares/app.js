import UUID from 'uuid';
import { ItemActions, ProviderActions } from '../actions/state';
import { ACTIONS_CONST } from '../constants';

export default store => next => (payload) => {
  const state = store.getState();
  const providers = state.find('providers');
  const { type, result, id } = payload;

  switch (type) {

    case ACTIONS_CONST.ITEM_ADD: {
      const itemId = result.id || UUID();
      const data = Object.assign({}, result, {
        id: itemId,
        selected: false,
      });
      const _id = id || state.find('providers').where({ selected: true }).get().id;

      next(ItemActions.add(data, _id));
      break;
    }

    case ACTIONS_CONST.PROVIDER_SELECT: {
      const provider = providers.where({ id });
      let _id = id;

      if (!provider) {
        _id = providers.get()[0].id;
      }

      next(ProviderActions.select(_id));
      break;
    }

    case ACTIONS_CONST.ITEM_SELECT: {
      const provider = providers.where({ selected: true });
      const items = provider.find('items');
      const item = items.where({ id });
      let _id = id;

      if (!item && items.get().length) {
        _id = items.get()[0].id;
      }

      next(ItemActions.select(_id));
      break;
    }

    case ACTIONS_CONST.ITEM_REMOVE: {
      const provider = providers.where({ selected: true });
      const items = provider.find('items');

      let itemIndex = 0;

      items.map((itm, index) => {
        if (itm.get('id') === id) {
          itemIndex = index;
        }
        return true;
      });

      const nextIndex = itemIndex + 1;
      const prevIndex = itemIndex - 1;
      const children = items.children;

      if (children[nextIndex]) {
        next(ItemActions.select(children[nextIndex].get('id')));
      } else if (children[prevIndex]) {
        next(ItemActions.select(children[prevIndex].get('id')));
      }

      next(ItemActions.remove(id));
      break;
    }

    default:
      next(payload);
  }
};
