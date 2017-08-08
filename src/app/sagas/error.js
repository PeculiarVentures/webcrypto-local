import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { DialogActions } from '../actions/ui';
import { WSActions } from '../actions/state';
import { WSController } from '../controllers/webcrypto_socket';
import { EventChannel } from '../controllers';
import { browserInfo } from '../helpers';

function* errorHandler({ data, action }) {
  const { message, stack } = data;
  let errorMessage = '';

  if (/Client.prototype.getServerInfo/.test(stack)) {
    errorMessage = 'NOT_SUPPORTED_LOCALHOST';
  } else if (action === 'request_create') {
    errorMessage = 'REQUEST_CREATE';
  } else if (action === 'import_item') {
    errorMessage = 'IMPORT_ITEM';
  } else if (/CKR_PIN_INCORRECT/.test(message)) {
    errorMessage = 'INCORRECT_PIN';
  } else if (/XMLHttpRequest.xmlHttp/.test(stack) || message === 'offline' || message === 'Failed to fetch') {
    errorMessage = 'OFFLINE';
  } else if (message === 'PIN is not approved') {
    errorMessage = 'UNAPPROVED_PIN';
  } else if (/C_DestroyObject/.test(message)) {
    errorMessage = 'REMOVE_ITEM';
  }

  switch (errorMessage) {
    case 'NOT_SUPPORTED_LOCALHOST': {
      yield put(DialogActions.open('not_supported_localhost'));
      break;
    }

    case 'REQUEST_CREATE': {
      yield put(DialogActions.open('request_create_error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      break;
    }

    case 'IMPORT_ITEM': {
      yield put(DialogActions.open('certificate_import_error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      break;
    }

    case 'INCORRECT_PIN': {
      yield put(DialogActions.open('incorrect_pin'));
      break;
    }

    case 'OFFLINE': {
      yield put(DialogActions.open('server_offline'));
      WSController.checkConnect();
      yield put(WSActions.status('offline'));
      break;
    }

    case 'UNAPPROVED_PIN': {
      yield put(DialogActions.open('unauthorize_pin'));
      break;
    }

    case 'REMOVE_ITEM': {
      yield put(DialogActions.open('remove_item_error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      break;
    }

    default:
      console.error(data);
  }

  return true;
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.ERROR, errorHandler),
  ];
}
