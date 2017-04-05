import { State } from 'quantizer';
import { PROVIDER } from '../../constants';
import { ProviderSchema } from '../schemes';

export default class ProviderModel extends State.Map {

  constructor(value) {
    super(Object.assign({}, PROVIDER.DEFAULT, value), ProviderSchema);
  }

}
