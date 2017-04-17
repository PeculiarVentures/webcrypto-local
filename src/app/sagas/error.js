import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { DialogActions } from '../actions/ui';
import { WSActions } from '../actions/state';
import { WSController } from '../controllers/webcrypto_socket';
import { EventChannel } from '../controllers';
import { browserInfo } from '../helpers';

function* errorHandler({ data, action }) {
  if (browserInfo() === 'Safari') {
    yield put(DialogActions.open('not_supported_localhost'));
    return true;
  }

  if (action) {
    switch (action) {
      case 'request_create':
        yield put(DialogActions.open('request_create_error'));
        EventChannel.emit('DIALOG:SET_MESSAGE', data.message);
        return true;

      case 'import_certificate':
        yield put(DialogActions.open('certificate_import_error'));
        EventChannel.emit('DIALOG:SET_MESSAGE', data.message);
        return true;

      default:
        return true;
    }
  }

  if ({}.hasOwnProperty.call(data, 'message')) {
    const { message, stack } = data;

    if (/CKR_PIN_INCORRECT/.test(message)) { // incorrent pin
      yield put(DialogActions.open('incorrect_pin'));
    } else if (/XMLHttpRequest.xmlHttp/.test(stack)) { // offline
      WSController.checkConnect();
      yield put(WSActions.status('offline'));
    } else if (/Client.prototype.getServerInfo/.test(stack)) { // not supported localhost (Firefox)
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
          console.error(data);

      }
    }
  } else {
    console.error(data);
  }
  return true;
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.ERROR, errorHandler),
  ];
}
