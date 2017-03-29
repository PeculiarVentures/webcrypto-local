import { takeEvery } from 'redux-saga';
import { ACTIONS_CONST } from '../../constants';
import * as Key from './key';

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, Key.getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_KEY, Key.getKey),
  ];
}
