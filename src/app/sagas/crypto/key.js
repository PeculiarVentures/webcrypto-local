import { put } from 'redux-saga/effects';
import { ErrorActions } from '../../actions/state';

/**
 * Get provider key IDs
 * @param {object} crypto
 * @returns {Promise|Array}
 */
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

/**
 * Set provider key
 * @param {object} crypto
 * @param {string} key
 * @returns {Promise|[]}
 */
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

/**
 * Get provider key
 * @param {object} crypto
 * @param {string} id
 * @returns {Promise|Boolean}
 */
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

/**
 * Remove provider key
 * @param {object} crypto
 * @param {string} id
 * @returns {boolean}
 */
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
