import { State } from 'quantizer';
import ProviderModel from './provider';

export default class ProviderListModel extends State.List {

  constructor(value) {
    super(value, ProviderModel);
  }

  add(result) {
    const provider = this
      .where({ id: result.id });

    if (provider) {
      provider.merge(result);
    } else {
      this.push(result);
    }

    return result.id;
  }

  select(id) {
    this.map((provider) => {
      provider.merge({ selected: false });

      if (provider.get('id') === id) {
        provider.merge({ selected: true });
      }
      return true;
    });
  }
}
