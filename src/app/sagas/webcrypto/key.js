import { ws } from '../../controllers/webcrypto_socket';

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
    console.log(error);
  }
  return false;
}

export function* getKeys({ providerId = 0 }) {
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    const keys = yield crypto.keyStorage.keys();
    console.log(keys);
    return keys;
  }
  return [];
}

export function* getKey({ providerId = 0, keyId }) {
  const alg = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-384',
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048,
  };
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    try {
      const key = yield crypto.keyStorage.getItem(keyId, alg, ['sign']);
      console.log(key);
      return key;
    } catch (error) {
      console.log(error);
    }
  }
  return false;
}
