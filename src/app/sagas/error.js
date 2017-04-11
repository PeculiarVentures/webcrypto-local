import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { DialogActions } from '../actions/ui';

function* errorHandler(error) {
  if ({}.hasOwnProperty.call(error.data, 'message')) {
    const { message } = error.data;

    if (/CKR_PIN_INCORRECT/.test(message)) {
      yield put(DialogActions.open('incorrect_pin'));
    } else {
      switch (message) {

        // case 'CryptoLogin timeout': {
        //   yield put(DialogActions.open('timeout_pin'));
        //   break;
        // }

        case '404: Not authorized': {
          yield put(DialogActions.open('unauthorize_pin'));
          break;
        }

        default:
          console.error(error);

      }
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
