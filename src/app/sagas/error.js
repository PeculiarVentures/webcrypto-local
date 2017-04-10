import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { DialogActions } from '../actions/ui';

function* errorHandler(error) {
  if ({}.hasOwnProperty.call(error.data, 'message')) {
    const { message } = error.data;
    switch (message) {

      // TODO: need update this message name
      case 'CKR_PIN_INCORRECT:160\n    at Error (native) C_Login:354': {
        yield put(DialogActions.open('incorrect_pin'));
        break;
      }

      case 'CryptoLogin timeout': {
        yield put(DialogActions.open('timeout_pin'));
        break;
      }

      default:
        console.error(error);

    }
  } else {
    console.error(error);
  }
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.ERROR, errorHandler),
  ];
}
