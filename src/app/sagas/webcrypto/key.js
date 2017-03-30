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

export function* createKey(crypto) {
  const keyInfo = {
    algorithm: {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
      modulusLength: 1024,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    usages: ['sign', 'verify'],
  };

  if (crypto) {
    const { algorithm, usages } = keyInfo;
    const { privateKey } = yield crypto.subtle.generateKey(algorithm, false, usages);
    yield crypto.keyStorage.setItem(privateKey);
  }
}

export function* removeKey(crypto, keyId) {
  if (crypto) {
    yield crypto.keyStorage.removeItem(keyId);
  }
  return false;
}
