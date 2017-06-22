import { State } from 'quantizer';
import { INITIAL_STATE } from '../../constants';
import UISchema from '../schemes/ui';

export default class UIModel extends State.Map {

  constructor() {
    super(INITIAL_STATE.DEFAULT, UISchema);
  }

}
