import { State } from 'quantizer';
import { KeySchema } from '../schemes';
import { KEY } from '../../constants';

export default class KeyModel extends State.Map {

  constructor(value) {
    super(Object.assign({}, KEY.DEFAULT, value), KeySchema);
  }

}
