import { State } from 'quantizer';
import ItemModel from './item';

export default class ItemListModel extends State.List {

  constructor(value) {
    super(value, ItemModel);
  }

  add(result) {
    const item = this
      .where({ id: result.id });

    if (item) {
      item.merge(result);
    } else {
      this.push(result);
    }

    return result.id;
  }

  select(id) {
    this.map((item) => {
      item.merge({ selected: false });

      if (item.get('id') === id) {
        item.merge({ selected: true });
      }
      return true;
    });
  }
}
