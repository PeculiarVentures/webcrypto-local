import { put } from 'redux-saga/effects';
import { ws } from '../../controllers/webcrypto_socket';
import { ErrorActions } from '../../actions/state';

export function* getCrypto(providerId) {
  try {
    const info = yield ws.info();
    const provider = info.providers[providerId];
    const crypto = yield ws.getCrypto(provider.id);
    const isLoggedIn = yield crypto.isLoggedIn();
    if (!isLoggedIn) {
      yield crypto.login();
    }
    return crypto;
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}

export function* getKeys(providerId = 0) {
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    return yield crypto.keyStorage.keys();
  }
  return [];
}

export function* getKey({ providerId = 0, keyId }) {
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    try {
      return yield crypto.keyStorage.getItem(keyId);
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}

// export function* removeKey({ providerId = 0, keyId }) {
//   const crypto = yield getCrypto(providerId);
//   if (crypto) {
//     yield crypto.keyStorage.removeItem(keyId);
//   }
//   return false;
// }
