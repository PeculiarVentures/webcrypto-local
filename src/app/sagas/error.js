import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { DialogActions } from '../actions/ui';
import { WSActions } from '../actions/state';
import { WSController } from '../controllers/webcrypto_socket';

function* errorHandler(error) {
  if ({}.hasOwnProperty.call(error.data, 'message')) {
    const { message, stack } = error.data;

    if (/CKR_PIN_INCORRECT/.test(message)) { // incorrent pin
      yield put(DialogActions.open('incorrect_pin'));
    } else if (/XMLHttpRequest.xmlHttp/.test(stack)) { // offline
      WSController.checkConnect();
      yield put(WSActions.status('offline'));
    } else if (/Client.prototype.getServerInfo/.test(stack)) { // not supported localhost
      yield put(DialogActions.open('not_supported_localhost'));
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
