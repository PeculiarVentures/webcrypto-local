import { ACTIONS_CONST } from '../../constants';

export default function (state, payload) {
  const { type, result, id } = payload;
  const providers = state.find('providers');
  switch (type) {

    case ACTIONS_CONST.ITEM_ADD: {
      const items = providers.where({ id }).find('items');
      items.add(result);
      return state;
    }

    case ACTIONS_CONST.ITEM_SELECT: {
      const items = providers.where({ selected: true }).find('items');
      items.select(id);
      return state;
    }

    case ACTIONS_CONST.ITEM_REMOVE: {
      const items = providers.where({ selected: true }).find('items');
      items.remove(id);
      return state;
    }

    default:
      return state;
  }
}
