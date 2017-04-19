import { put } from 'redux-saga/effects';
import { ErrorActions } from '../../actions/state';

export function* keyGetIDs(crypto) {
  if (crypto) {
    try {
      return yield crypto.keyStorage.keys();
    } catch (error) {
      yield put(ErrorActions.error(error));
      return [];
    }
  }
  return [];
}

export function* keySet(crypto, key) {
  if (crypto) {
    try {
      return yield crypto.keyStorage.setItem(key);
    } catch (error) {
      yield put(ErrorActions.error(error));
      return [];
    }
  }
  return [];
}

export function* keyGet(crypto, id) {
  if (crypto) {
    try {
      return yield crypto.keyStorage.getItem(id);
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}


export function* keyRemove(crypto, id) {
  if (crypto) {
    try {
      yield crypto.keyStorage.removeItem(id);
      return true;
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}
