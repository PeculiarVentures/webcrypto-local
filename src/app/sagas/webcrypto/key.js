import { put } from 'redux-saga/effects';
import { ErrorActions } from '../../actions/state';

export function* getKeys(crypto) {
  if (crypto) {
    return yield crypto.keyStorage.keys();
  }
  return [];
}

export function* getKey(crypto, keyId) {
  if (crypto) {
    try {
      return yield crypto.keyStorage.getItem(keyId);
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}

export function* removeKey(crypto, keyId) {
  if (crypto) {
    yield crypto.keyStorage.removeItem(keyId);
  }
  return false;
}
