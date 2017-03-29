import { takeEvery } from 'redux-saga';
import { ACTIONS_CONST } from '../constants';

function* errorHandler(error) {
  console.error(error);
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.ERROR, errorHandler),
  ];
}
