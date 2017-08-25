import { put } from 'redux-saga/effects';
import { ws } from '../../controllers/webcrypto_socket';
import { ErrorActions } from '../../actions/state';

/**
 * Get providers list
 * @returns {Array}
 */
export function* providerGetList() {
  try {
    const info = yield ws.info();
    return info.providers;
  } catch (error) {
    yield put(ErrorActions.error(error));
    return [];
  }
}

/**
 * Check provider logged state
 * @param {object} crypto
 * @returns {boolean}
 */
export function* providerIsLogged(crypto) {
  if (crypto) {
    try {
      return yield crypto.isLoggedIn();
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

/**
 * Login provider
 * @param {object} crypto
 * @returns {boolean}
 */
export function* providerLogin(crypto) {
  if (crypto) {
    try {
      yield crypto.login();
      return true;
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

/**
 * Get provider crypto
 * @param {string} id
 * @returns {Promise}
 */
export function* cryptoGet(id) {
  try {
    return yield ws.getCrypto(id);
  } catch (error) {
    yield put(ErrorActions.error(error));
    return false;
  }
}

/**
 * Reset provider crypto
 * @param {string} id
 * @returns {Promise}
 */
export function* cryptoReset(id) {
  try {
    const crypto = yield ws.getCrypto(id);
    return yield crypto.reset();
  } catch (error) {
    yield put(ErrorActions.error(error));
    return false;
  }
}

/**
 * Get provider
 * @param {string} id
 * @returns {Promise}
 */
export function* providerGet(id) {
  try {
    const provider = yield cryptoGet(id);
    const isLogged = yield providerIsLogged(provider);
    return {
      provider,
      isLogged,
    };
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}
